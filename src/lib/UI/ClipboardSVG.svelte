<script>
    export let fill = "white";
    export let isClickActive = false;
  </script>
  
  <svg
    class="hover-effect"
    class:click-active={isClickActive}
    width="20px"
    height="20px"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    fill={isClickActive ? "#9900FC" : fill}
  >
    >
    <path
      d="M5.5028,4.627 L5.5,6.75 L5.5,17.2542 C5.5,19.0491 6.95507,20.5042 8.75,20.5042 L17.3663,20.5045 C17.0573,21.3782 16.224,22.0042 15.2444,22.0042 L8.75,22.0042 C6.12665,22.0042 4,19.8776 4,17.2542 L4,6.75 C4,5.76929 4.62745,4.93512 5.5028,4.627 Z M17.75,2 C18.9926,2 20,3.00736 20,4.25 L20,17.25 C20,18.4926 18.9926,19.5 17.75,19.5 L8.75,19.5 C7.50736,19.5 6.5,18.4926 6.5,17.25 L6.5,4.25 C6.5,3.00736 7.50736,2 8.75,2 L17.75,2 Z M17.75,3.5 L8.75,3.5 C8.33579,3.5 8,3.83579 8,4.25 L8,17.25 C8,17.6642 8.33579,18 8.75,18 L17.75,18 C18.1642,18 18.5,17.6642 18.5,17.25 L18.5,4.25 C18.5,3.83579 18.1642,3.5 17.75,3.5 Z"
    >
    </path>
  </svg>
  
  <style>
    .hover-effect:hover {
      fill: #00ff00; /* Green color on hover */
    }
  
    .click-active.click-active {
      fill: #9900fc; /* Purple color when clicked */
    }
  </style>
  