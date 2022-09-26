const job_types = {
  permanent: true,
  "early-career-program": true,
  "full-time-contractor": false,
  "short-term": false,
  internship: false,
};
const categories = {
  backend: true,
  "client-c": true,
  data: false,
  "engineering-leadership": false,
  "machine-learning": true,
  mobile: false,
  "network-engineering-it": false,
  security: false,
  "tech-research": false,
  web: true,
};

const SKIP_SENIOR = true; // Skips any listings containing 'Senior' string

const table_headers = ["Name", "Category", "Location", "Remote", "URL"];
let sort_order = ["Location", "Category", "Name"]; // sorting column priority - must be terms in the table_headers
let reverse_sort = true; // applies to all columns

const SEARCH_ROOT =
  "https://api-dot-new-spotifyjobs-com.nw.r.appspot.com/wp-json/animal/v1/job/search?";

document.addEventListener("DOMContentLoaded", function () {
  main();
});

const main = () => {
  const job_types_checks = Object.keys(job_types)
    .map(
      (key) =>
        `<input type="checkbox" id="${key}" name="${key}" value="${key}" ${
          job_types[key] ? "checked" : ""
        }><label for="${key}">&nbsp;${key}</label>`
    )
    .join("<br/>");

  const jobTypesForm = document.getElementById("jobTypes");
  jobTypesForm.innerHTML = job_types_checks;

  const categories_checks = Object.keys(categories)
    .map(
      (key) =>
        `<input type="checkbox" id="${key}" name="${key}" value="${key}" ${
          categories[key] ? "checked" : ""
        }><label for="${key}">&nbsp;${key}</label>`
    )
    .join("<br/>");

  const jobCategoriesForm = document.getElementById("jobCategories");
  jobCategoriesForm.innerHTML = categories_checks;

  const sortPriorityTag = document.getElementById("sortPriority");
  const sortDiv = document.getElementById("reverseSortDiv");
  sortDiv.innerHTML = `<label for="reverseSort">Reverse Sort:&nbsp;</label><input type="checkbox" id="reverseSort" name="reverseSort" value="reverseSort" ${
    reverse_sort ? "checked" : ""
  }>`;

  const executeSearchQuery = () => {
    sortPriorityTag.innerHTML =
      "Sort Priority: <strong>" +
      sort_order.join("</strong>, <strong>") +
      "</strong>";

    reverse_sort = sortDiv.querySelector("#reverseSort").checked;

    const jobTypes = jobTypesForm.querySelectorAll(
      "input[type=checkbox]:checked"
    );
    const jobCategories = jobCategoriesForm.querySelectorAll(
      "input[type=checkbox]:checked"
    );
    const true_categories = Array.from(jobCategories.values())
      .map((jobCategory) => jobCategory.id)
      .join("%2C");
    const true_job_types = Array.from(jobTypes.values())
      .map((jobType) => jobType.id)
      .join("%2C");
    const query = `c=${true_categories}&j=${true_job_types}`;
    fetch(SEARCH_ROOT + query)
      .then((response) => response.json())
      .then((data) => handleJobData(data))
      .catch((err) => console.error(err));
  };
  executeSearchQuery();

  document
    .getElementById("searchBtn")
    .addEventListener("click", executeSearchQuery);

  function handleJobData(data) {
    const listings = data["result"];
    const JOB_ROOT = "https://www.lifeatspotify.com/jobs/";

    let senior_skipped = 0;
    let total_jobs = 0;
    const table_rows = [];
    for (let i = 0; i < listings.length; i++) {
      if (SKIP_SENIOR && listings[i].text.toLowerCase().includes("senior")) {
        senior_skipped++;
        continue;
      }
      const name = listings[i].text.replace("&amp;", "&");
      const category = listings[i].sub_category.name;
      const location = listings[i].location.location;
      const remote = listings[i].is_remote;
      const is_remote = remote ? "Yes" : "No";
      const job_url = JOB_ROOT + listings[i].id;
      const job_link = `<a href="${job_url}" target="_blank">Link</a>`;

      table_rows.push([name, category, location, is_remote, job_link]);
      total_jobs++;
    }

    table_rows.sort((a, b) => {
      let result = 0;
      for (let i = 0; i < sort_order.length; i++) {
        const col = table_headers.indexOf(sort_order[i]);
        if (a[col] < b[col]) result = -1;
        else if (a[col] > b[col]) result = 1;

        if (result !== 0) break;
      }
      return reverse_sort ? -result : result;
    });

    let html = "<table border='1|1'>";

    html += "<tr id='headerRow'>";
    for (let i = 0; i < table_headers.length; i++) {
      html += `<th scope="col" style='cursor:pointer'>${table_headers[i]}</th>`;
    }
    html += "</tr>";

    for (let i = 0; i < table_rows.length; i++) {
      html += "<tr>";
      for (let j = 0; j < table_rows[i].length; j++) {
        html += "<td>" + table_rows[i][j] + "</td>";
      }
      html += "</tr>";
    }

    html += "</table>";
    document.getElementById("box").innerHTML = html;

    document.getElementById("headerRow").addEventListener("click", (e) => {
      const column = e.target.innerHTML;
      if (sort_order.includes(column))
        sort_order = sort_order.filter((item) => item !== column);
      else sort_order.push(column);
      executeSearchQuery();
    });

    let stats = `Total Jobs Shown: ${total_jobs}`;
    stats += `<br/>Skipped ${senior_skipped} Senior Jobs`;
    document.getElementById("statsP").innerHTML = stats;
  }
};
