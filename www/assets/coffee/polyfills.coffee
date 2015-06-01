unless Array::forEach
  Array::forEach = (fn, scope) ->
    "use strict"
    i = undefined
    len = undefined
    i = 0
    len = @length

    while i < len
      fn.call scope, this[i], i, this  if i of this
      ++i

###
Converts the target object to an array.
###
window.toArray = (o) ->
  Array::slice.call o


Element::prependChild = (child) ->
  @insertBefore child, @firstChild