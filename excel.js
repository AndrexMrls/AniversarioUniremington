const selectedActivity = document.getElementById(decodeURIComponent(location.hash.slice(1)));

if (selectedActivity) {
  requestAnimationFrame(() => selectedActivity.scrollIntoView({ block: 'center' }));
}
