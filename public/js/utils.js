function dismissPopup() {
  let popupList = currentMap.Overlays.list();
  for (let item of popupList) {
    item.pop(false);
  }
}
function plant() {
  let popupList = currentMap.Overlays.list();
  for (let item of popupList) {
    if (item.location()[0] && item.location()[0].lon === 100.613124) {
      currentMap.Overlays.remove(item);
    }
  }
}
