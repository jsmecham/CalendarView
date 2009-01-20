CalendarView
============

A lightweight JavaScript calendar widget that follows current web standards
and best practices. It was developed for use with the Prototype JavaScript
framework (requires Prototype 1.6 or greater).

More information (including examples and latest releases) can be found at
[calendarview.org](http://calendarview.org/).

CalendarView is developed and maintained by [Justin Mecham](mailto:justin@aspect.net).



Basic Usage
-----------

### Step 1 ###

Include the JavaScript (calendarview.js) and CSS (calendarview.css)
in the header of your HTML document:

    <link rel="stylesheet" type="text/css" href="path/to/calendarview.css" />
    <script type="text/javascript" src="path/to/calendarview.js"></script>

### Step 2 ###

Create a container element for the calendar to be displayed within:

    <div id="my_calendar">
      <!-- CalendarView will be inserted here! -->
    </div>

### Step 3 ###

Create another container element to receive the date that the user
selects:

    <span id="selected_date"><!-- Selected date will be inserted here! --></span>

For most cases, you're going to want to add this to a form. To add the value
to a form element, just reference the input element by its dom id:

    <input type="hidden" id="selected_date" />

### Step 4 ###

Initialize a CalendarView instance for the container and date field
you've set up:

    <script type="text/javascript">
      var calendar = CalendarView.new(
        { parentElement: 'my_calendar', dateField: 'selected_date' }
      )
    </script>



Customization
-------------

Since it adheres to the latest web standards and best practices, its simple
to integrate CalendarView with your web site or project. All styling is done
via CSS and functionally integrating with the site is as simple as registering
your JavaScript as callbacks on the calendar.

### Output HTML ###

You are encouraged to style the calendar to match your specific needs. For
reference, the following is the HTML as it is output from the script:

    <div class="calendar">
      <table>
        <thead>
          <tr>
            <td colspan="7" class="title">January 2009</td>
          </tr>
          <tr>
            <td class="button">«</td>
            <td class="button">‹</td>
            <td colspan="3" class="button">Today</td>
            <td class="button">›</td>
            <td class="button">»</td>
          </tr>
          <tr>
            <th class="weekend">S</th>
            <th>M</th>
            <th>T</th>
            <th>W</th>
            <th>T</th>
            <th>F</th>
            <th class="weekend">S</th>
          </tr>
        </thead>
        <tbody>
          <tr class="days">
            <td class="otherDay weekend">28</td>
            <td class="otherDay">29</td>
            <td class="otherDay">30</td>
            <td class="otherDay">31</td>
            <td>1</td>
            <td>2</td>
            <td class="weekend">3</td>
          </tr>
          ... snip ...
        </tbody>
      </table>
    </div>



Additional Resources
--------------------

* [CalendarView Web Site](http://calendarview.org/)
* [Source Code (GitHub)](http://github.com/jsmecham/calendarview/)
* [Issue Tracker (Lighthouse)](http://aspect.lighthouseapp.com/projects/23770-calendarview/overview)
