/**
 * On HTML loaded and pared
 */
window.addEventListener("DOMContentLoaded", () => {

  /**
   * Initialize bootstrap
   */
  window.BSN.initCallback();

  /**
   * Make main section as big as screen
   */
  for (const event of ["orientationchange", "load", "resize"]) {
    window.addEventListener(event, () => {
      document.querySelectorAll(".screen-full").forEach(element => {
        element.style.minHeight = window.innerHeight + "px";
      });
    });
  }

  /**
   * Initialize inquiry iframe
   */
  const name = "Stone Crusher Plant";
  const url = "https://almaahadeng.com/product/stone-crusher-plant/";
  document.querySelector("#inquiry-iframe").src = (
    `https://almaahadeng.com/info/#/inquiry?name=${name}&link=${url}`
  );

  /**
   * Initialize google maps iframe
   */
  const place = "ChIJBcnbvNpeXz4ROnm9YZspwmQ";
  const key = "AIzaSyAWR_qL8M5AG0Woyn0Wv3UG7ddoijITsiU";
  document.querySelector("#maps-iframe").src = (
    `https://www.google.com/maps/embed/v1/place?q=place_id:${place}&key=${key}`
  );
});
