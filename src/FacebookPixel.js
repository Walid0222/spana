// src/FacebookPixel.js
import React, { useEffect } from 'react';

/* global fbq */ // Declare 'fbq' as a global variable for ESLint

const FacebookPixel = () => {
  useEffect(() => {
    // Adding a semicolon before the function to resolve the 'expression' error
    ;(function(f, b, e, v, n, t, s) {
      if (f.fbq) return
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      }
      if (!f._fbq) f._fbq = n
      n.push = n
      n.loaded = !0
      n.version = '2.0'
      n.queue = []
      t = b.createElement(e)
      t.async = !0
      t.src = v
      s = b.getElementsByTagName(e)[0]
      s.parentNode.insertBefore(t, s)
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')

    // Initialize the Pixel and track a PageView
    fbq('init', '1295981624920104') // Replace with your Pixel ID
    fbq('track', 'PageView')
  }, [])

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src="https://www.facebook.com/tr?id=1295981624920104&ev=PageView&noscript=1"
        alt="Facebook Pixel"
      />
    </noscript>
  )
}

export default FacebookPixel