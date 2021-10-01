import json2mq from 'json2mq'

export function convertBreakpointsToMediaQueries(breakpoints) {
  const keys = Object.keys(breakpoints)
  const values = keys.map(key => breakpoints[key])
  const arrValues = values.filter(i => i.constructor.name == "Array");
  const elements = delArr(values);
  let breakpointValues;
  if (elements.length == 0) {
    breakpointValues = [...arrValues]
  }
  else {
    breakpointValues = [...arrValues, 1, ...elements.slice(0, -1)]
  }
  let options;
  const mediaQueries = breakpointValues.reduce((sum, value, index) => {

    if (value == Infinity) return {}
    if (Array.isArray(value)) {
      options = Object.assign(
        {
          minWidth: value[0]
        },
        value[1] !== Infinity ? { maxWidth: value[1] - 1 } : {}
      )
    }
    else {
      options = Object.assign(
        {
          minWidth: value - 1,
        },
        index < keys.length - 1 ? { maxWidth: breakpointValues[index + 1] - 1 } : {}
      )

    }
    const mediaQuery = json2mq(options)

    return Object.assign(
      sum,
      {
        [keys[index]]: mediaQuery,
      }
    )
  }, {})
  return mediaQueries
}

function delArr(arr) {
  return arr.filter(i => i.constructor.name != "Array");
}

export function transformValuesFromBreakpoints(breakpoints, values, currentBreakpoint) {
  const findClosestValue = (currentBreakpoint) => {
    if (values[currentBreakpoint] !== undefined) return values[currentBreakpoint]
    const index = breakpoints.findIndex(b => b === currentBreakpoint)
    const newBreakpoint = index !== -1 || index !== 0 ? breakpoints[index - 1] : null
    if (!newBreakpoint) return values[index]
    return values[newBreakpoint] !== undefined ? values[newBreakpoint] : findClosestValue(newBreakpoint)
  }
  return findClosestValue(currentBreakpoint)
}

export function selectBreakpoints(breakpoints, currentBreakpoint) {
  const index = breakpoints.findIndex(b => b === currentBreakpoint)
  return breakpoints.slice(index)
}

export function subscribeToMediaQuery(mediaQuery, enter) {
  const mql = window.matchMedia(mediaQuery)
  const cb = ({ matches }) => {
    if (matches) enter()
  }
  mql.addListener(cb) //subscribing
  cb(mql) //initial trigger
}