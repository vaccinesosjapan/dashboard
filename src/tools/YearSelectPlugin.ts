// This plugin based on the flatpickr-year-select-plugin.
// To apply custom theme properly, I made this code.
//  https://github.com/bearholmes/flatpickr-year-select-plugin

export interface YearSelectPluginConfig {
  startYear?: number
  endYear?: number
  yearUnit?: string
  yearFirst?: boolean
}

const YearSelectPlugin = function (config: YearSelectPluginConfig) {
  const yearSelectElem = document.createElement("select")
  yearSelectElem.classList.add("flatpickr-monthDropdown-months")

  const currentYear = new Date().getFullYear()
  if(config.startYear === undefined)
    config.startYear = currentYear - 3
  if(config.endYear === undefined)
    config.endYear = currentYear + 3

  for (let i = config.startYear; i <= config.endYear; i++) {
    const optionElem = document.createElement("option")
    optionElem.setAttribute('class', 'flatpickr-monthDropdown-month')
    optionElem.value = String(i)
    if(config.yearUnit !== undefined)
      optionElem.text = String(`${i}${config.yearUnit}`)
    else
      optionElem.text = String(`${i}`)
    yearSelectElem.appendChild(optionElem)
  }
  yearSelectElem.value = String(config.startYear)

  return function (fp: any) {
    if (!fp) return;

    yearSelectElem.addEventListener("change", function (evt) {
      const target = evt.target as HTMLSelectElement
      if (!target) return
      const year = target.options[target.selectedIndex].value

      fp.changeYear(Number(year))
      fp.redraw()
    })
   
    fp.yearSelectElem = yearSelectElem

    return {
      onReady: function onReady() {
        const collection = fp.calendarContainer.getElementsByClassName('flatpickr-current-month')
        if (collection.length == 0) return

        const currentMonthElem = collection[0]
        const monthSelectElem = currentMonthElem.childNodes[0]
        const originalYearInputElem = currentMonthElem.childNodes[1]

        if(config.yearFirst !== undefined && config.yearFirst)
          currentMonthElem.insertBefore(fp.yearSelectElem, monthSelectElem)
        else
          currentMonthElem.insertBefore(fp.yearSelectElem, originalYearInputElem)

        originalYearInputElem.style.display = 'none'

        if (!fp.config.minDate) fp.set("minDate", `${config.startYear}-01-01`)
        if (!fp.config.maxDate) fp.set("maxDate", `${config.endYear}-12-31`)
      },
      onOpen: function onOpen(
        _selectedDates: any,
        _dateStr: any,
        instance: { currentYear: any }
      ) {
        yearSelectElem.value = String(instance.currentYear)
      },
      onYearChange: function onYearChange(
        _selectedDates: any,
        _dateStr: any,
        instance: { currentYear: any }
      ) {
        yearSelectElem.value = String(instance.currentYear)
      },
    };
  };
};

export default YearSelectPlugin
