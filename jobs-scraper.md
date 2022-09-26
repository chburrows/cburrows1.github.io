---
layout: default
title: Spotify Job Table
permalink: /spotify-jobs
script: job-scraper.js
---

## Job Types

<div style="border:1px solid black; margin-bottom: 1em; padding: 1em">
    <form id="jobTypes"></form>
</div>

## Job Categories

<div style="border:1px solid black; margin-bottom: 1em; padding: 1em">
    <form id="jobCategories" onchange=""></form>
</div>

## Sorting

<p id="sortPriority">Sort Priority:</p>
<div id="reverseSortDiv"></div>

---

<button type="button" id="searchBtn" style="
  background-color: #008CBA;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
">Search</button>

## Table

> Click column headers to adjust sorting order.

<div id="box"></div>

---

<p id="statsP"></p>
