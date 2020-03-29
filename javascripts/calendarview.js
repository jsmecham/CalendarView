/**
 * class CalendarView
 * CalendarView 2.0
 *
 * 
 *
**/

var CalendarView = Class.create();

/**
 * CalendarView.monthNames
**/
CalendarView.monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

/**
 * CalendarView.shortMonthNames
**/
CalendarView.shortMonthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov',
  'Dec'
];

/**
 * CalendarView.dayNames
**/
CalendarView.dayNames = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

/**
 * CalendarView.shortDayNames
**/
CalendarView.shortDayNames = [
  'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
];

/**
 * CalendarView.instances -> Array
**/
CalendarView.instances = $A([]);

/**
 * CalendarView Prototype
**/

CalendarView.prototype = {

  displayName: "CalendarView",

  /**
   * CalendarView#date -> Date | false
   *
   * The current date.
  **/
  date: false,

  /**
   * CalendarView#parentElement -> Element | false
   *
   * The parent container element.
  **/
  parentElement: false,

  /**
   * CalendarView#element -> Element | false
   *
   * The calendar element.
  **/
  element: false,

  /**
   * CalendarView#onChange -> Function | false
   *
   * If defined, this function will be called when the date changes.
  **/
  onChange: false,

  // Initialization ----------------------------------------------------------

  initialize: function(options)
  {
    Object.extend(this, options || {});

    // Default Options
    if (!this.date) this.date = new Date();

    // Draw the Calendar
    this.redraw();
  },

  // -------------------------------------------------------------------------

  /**
   * CalendarView#redraw() -> null
  **/
  redraw: function()
  {
    var date       = new Date(this.date),
        today      = new Date(),
        thisYear   = today.getFullYear(),
        thisMonth  = today.getMonth(),
        thisDay    = today.getDate(),
        month      = date.getMonth(),
        dayOfMonth = date.getDate();

    // Calculate the first day to display (including the previous month)
    date.setDate(1);
    date.setDate(-(date.getDay()) + 1);
  
    // Fill in the days of the month
    this.getElement().select("tbody tr").each(function(row, i)
    {
      var rowHasDays = false;
      row.immediateDescendants().each(function(cell, j)
      {
        var day            = date.getDate(),
            dayOfWeek      = date.getDay(),
            isCurrentMonth = (date.getMonth() == month);
  
        // Reset classes on the cell
        cell.writeAttribute("data-date", date);
        cell.writeAttribute("class", false);
        cell.writeAttribute("data-action", "selectDate");
        cell.update(day);
  
        // Account for days of the month other than the current month
        if (!isCurrentMonth)
          cell.addClassName("otherDay");
        else
          rowHasDays = true;
  
        // Ensure the current day is selected
        if (isCurrentMonth && day == dayOfMonth)
          cell.addClassName("selected");
  
        // Today
        if (date.getFullYear() == thisYear && date.getMonth() == thisMonth && day == thisDay)
          cell.addClassName("today");
  
        // Weekend
        if ([0, 6].indexOf(dayOfWeek) != -1)
          cell.addClassName("weekend");
  
        // Set the date to tommorrow
        date.setDate(day + 1);
      }, this);

      // Hide the extra row if it contains only days from another month
      rowHasDays ? row.show() : row.hide();
    }, this);

    this.getElement().down("td.title").update(this.format("%B %Y"));

    if (!this.getElement().parent)
      this.parentElement.insert(this.getElement());
  },
  
  // Element -----------------------------------------------------------------
  
  getElement: function()
  {
    if (!this.element)
    {
      this.element = new Element("div", { className: "CalendarView" });
  
      // Table Element
      var tableElement = new Element("table");
  
      // Table Header Element
      var tableHeaderElement = new Element("thead");
      tableElement.appendChild(tableHeaderElement);
  
      // Title Placeholder
      var titleRowElement  = new Element("tr");
      var titleCellElement = new Element("td", { colSpan: 7, className: "title" });
      titleRowElement.appendChild(titleCellElement);
      tableHeaderElement.appendChild(titleRowElement);
  
      // Navigation Elements
      var navigationRowElement = new Element("tr", { className: "navigation" });
      navigationRowElement.appendChild(new Element("th", { "data-action": "showPreviousYear", title: "Go to Previous Year" }).update("&#x00ab;"));
      navigationRowElement.appendChild(new Element("th", { "data-action": "showPreviousMonth", title: "Go to Previous Month" }).update("&#x2039;"));
      navigationRowElement.appendChild(new Element("th", { "data-action": "showToday", title: "Go to Today", colSpan: 3 }).update("Today"));
      navigationRowElement.appendChild(new Element("th", { "data-action": "showNextMonth", title: "Go to Next Month" }).update("&#x203a;"));
      navigationRowElement.appendChild(new Element("th", { "data-action": "showNextYear", title: "Go to Next Year" }).update("&#x00bb;"));
      tableHeaderElement.appendChild(navigationRowElement);
  
      // Weekday Header Elements
      var weekdayHeaderRow = new Element("tr", { className: "weekdays" });
      for (var i = 0; i < 7; ++i)
      {
        var weekdayCellElement = new Element("th").update(CalendarView.shortDayNames[i].substring(0, 1));
        if (i === 0 || i === 6) weekdayCellElement.addClassName("weekend");
        weekdayHeaderRow.appendChild(weekdayCellElement);
      }
      tableHeaderElement.appendChild(weekdayHeaderRow);
  
      // Day Elements
      var tableBodyElement = tableElement.appendChild(new Element("tbody"));
      for (i = 6; i > 0; --i)
      {
        var tableBodyRowElement = tableBodyElement.appendChild(new Element("tr"));
        for (var j = 7; j > 0; --j)
          tableBodyRowElement.appendChild(new Element("td"));
      }
  
      this.element.appendChild(tableElement);

      // Hook Up Event Handlers
      this.element.on("click", "[data-action]", this.handleActionEvent.bind(this));
    }
  
    return this.element;
  },

  handleActionEvent: function(event, element)
  {
    var action = element.readAttribute("data-action");
    if (Object.isFunction(this[action]))
      this[action](element);
  },

  // Accessors & Setters -----------------------------------------------------
  
  setDate: function(newDate)
  {
    newDate = new Date(newDate);
    this.date = newDate;
    this.redraw();

    if (Object.isFunction(this.onChange))
      this.onChange(this, newDate);

    return newDate;
  },

  // Actions -----------------------------------------------------------------
  
  showPreviousYear: function()
  {
    var newDate = this.date,
        year    = newDate.getFullYear() - 1;
  
    newDate.setFullYear(year);
    this.setDate(newDate);
  },
  
  showPreviousMonth: function()
  {
    var newDate = this.date,
        month   = newDate.getMonth() - 1;
  
    if (month < 0)
    {
      newDate.setMonth(11);
      newDate.setFullYear(newDate.getFullYear() - 1);
    }
    else
      newDate.setMonth(month);

    this.setDate(newDate);
  },
  
  showToday: function()
  {
    var newDate = new Date();
    this.setDate(newDate);
  },
  
  showNextMonth: function()
  {
    var newDate = this.date,
        month   = newDate.getMonth() + 1;
  
    if (month > 11)
    {
      newDate.setMonth(0);
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    else
      newDate.setMonth(month);

    this.setDate(newDate);
  },
  
  showNextYear: function()
  {
    var newDate = this.date,
        year    = newDate.getFullYear() + 1;

    newDate.setFullYear(year);
    this.setDate(newDate);
  },

  selectDate: function(element)
  {
    var selectedDate = element.readAttribute("data-date");
    this.setDate(selectedDate);
  },

  /**
   * CalendarView#format(format) -> String
   *
   * - format (String): the format string
   *
   * Formats the *date* according to the directives given in the *format*
   * string.
   *
   * ## Format Components
   *
   * The format string may contain the following formatting components. Any
   * string not matching the following will simply be passed through:
   *
   *     %a  // The abbreviated weekday name (Sun, Mon, Tue, ...)
   *     %A  // The full weekday  name (Sunday, Monday, Tuesday, ...)
   *     %b  // The abbreviated month name (Jan, Feb, Mar, ...)
   *     %B  // The full month  name (January, February, March, ...)
   *     %d  // Day of the month (1..31)
   *     %dd // Padded day of the month (01..31)
   *     %m  // Month of the year (1..12)
   *     %mm // Padded month of the year (01..12)
   *     %o  // English ordinal suffix for the day of the month (st, nd, rd or th)
   *     %w  // Day of the week (Sunday is 0, 0..6)
   *     %y  // Year without a century (00..99)
   *     %Y  // Year with century (2010)
   *     %z  // Time Zone Offset (-4, -6, +10, ...)
   *
   * ## Examples
   *
   * #### "January 1, 2010"
   *
   *     calendar.format("%B %d, %Y")
   *
  **/
  format: function(format)
  {
    var formatted,
        ordinals   = $H({
          1:  "st", 2:  "nd", 3:  "rd", 4:  "th", 5:  "th", 6:  "th", 7:  "th",
          8:  "th", 9:  "th", 10: "th", 11: "th", 12: "th", 13: "th", 14: "th",
          15: "th", 16: "th", 17: "th", 18: "th", 19: "th", 20: "th", 21: "st",
          22: "nd", 23: "rd", 24: "th", 25: "th", 26: "th", 27: "th", 28: "th",
          29: "th", 30: "th", 31: "st" }),
        syntax     = /(^|.|\r|\n)(%([A-Za-z]{1,2}))/,
        components = {
          a:  CalendarView.shortDayNames[this.date.getDay()],
          A:  CalendarView.dayNames[this.date.getDay()],
          b:  CalendarView.shortMonthNames[this.date.getMonth()],
          B:  CalendarView.monthNames[this.date.getMonth()],
          d:  this.date.getDate(),
          dd: this.date.getDate().toPaddedString(2),
          m:  this.date.getMonth() + 1,
          mm: (this.date.getMonth() + 1).toPaddedString(2),
          o:  "%o", // Pass Through
          w:  this.date.getDay(),
          y:  this.date.getFullYear().toString().substring(2, 4),
          Y:  this.date.getFullYear(),
          z:  "%z" // Pass Through
        };
    formatted = format.interpolate(components, syntax);
    if (formatted.indexOf("%o") >= 0)
      formatted = formatted.replace("%o", ordinals.get(this.date.getDate()));
    if (formatted.indexOf("%z") >= 0)
      formatted = formatted.replace("%z", (this.getTimezoneOffset() / 60) > 0 ? (this.getTimezoneOffset() / 60) * -1 : "+" + (this.getTimezoneOffset() / 60));
    return formatted;
  }

};

/**
 * CalendarView.initialize() -> false
**/
CalendarView.initialize = function()
{
  $$(".CalendarView").each(function(element) {
    var initialDate      = element.readAttribute("data-date") || false,
        onChangeFunction = element.readAttribute("data-onChange"),
        instance         = new CalendarView({
          date: initialDate,
          parentElement: element,
          onChange: onChangeFunction
        });

    // Yea... This is bad.
    if (onChangeFunction && !Object.onChangeFunction)
      instance.onChange = eval(onChangeFunction);

    CalendarView.instances.push(instance);
  });
};

//
// Automaticall initialize any CalendarView instances in the DOM that have
// the CSS class name "CalendarView".
//

document.observe("dom:loaded", CalendarView.initialize);
