#pragma once
/**
 * @brief Override all these variables with your own, custom
 * values. Since this file is included in the `.gitignore`
 * file, your changes should not show up in the list of git
 * modifications to commit/push.
 *
 */
#ifndef ENVID                    // Default WiFi configuration
#define SECRET_SSID "Your SSID"  // This should be the WiFi network name you're connecting everything to.
#define SECRET_PASS "P@ssw0rd"   // This should be the WiFi password of the network you're connecting everything to.
#endif

#if ENVID == 1                         // Set this flag if you switch between WiFi networks and don't want to change code every time.
#define SECRET_SSID "Your Other SSID"  // This should be the WiFi network name you're connecting everything to.
#define SECRET_PASS "P@ssw0rd"         // This should be the WiFi password of the network you're connecting everything to.
#endif