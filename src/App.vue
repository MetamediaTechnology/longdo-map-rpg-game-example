<template>
  <div style="height: 100vh">
    <longdo-map
      @load="initMap"
      :location="{ lat: 13.519863, lon: 100.723674 }"
      :lastView="false"
      ui="Mobile"
      :layer="['CLEAR']"
    >
      <longdo-map-rectangle
        :location="{ lat: 13.72264, lon: 100.52931 }"
        :size="{ width: 1, height: 1 }"
        :texture="require('@/assets/bg-map.png')"
      />
    </longdo-map>
  </div>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      map: undefined,
      player: undefined,
      teleportA: undefined,
      teleportB: undefined,
      item: undefined,
      wallArea: undefined,
      canWalk: true,
    }
  },
  mounted () {
    alert('I = UP\nJ = LEFT\nK = DOWN\nL = RIGHT')
  },
  methods: {
    initMap (map) {
      this.map = map
      this.map.Ui.Zoombar.visible(false)
      this.map.Ui.Geolocation.visible(false)
      this.map.Ui.LayerSelector.visible(false)
      this.map.Ui.Crosshair.visible(false)
      this.map.Ui.Scale.visible(false)
      this.map.zoom(12)
      this.map.zoomRange({
        min: 12,
        max: 12
      })
      window.currentMap = this.map
      
      this.setupPlayer()
      this.setupNpc()
      this.setupPlant()
      this.setupTeleportPortal()
      this.setupWall()
    },
    setupPlayer () {
      this.player = new window.longdo.Rectangle({
        lat: 13.519863, lon: 100.723674
      }, {
        width: 0.015, height: 0.015
      }, {
        weight: 10,
        texture: require('@/assets/characters/player/down.png')
      })
      this.map.Overlays.add(this.player)

      document.addEventListener('keydown', (e) => {
        if (!['i', 'j', 'k', 'l'].includes(e.key)) return
        if (!this.canWalk) return
        this.canWalk = false
        setTimeout(() => {
          let currentLocation = this.player.location()[0]
          let newLocation
          if (e.key === 'i') {
            newLocation = { lon: currentLocation.lon, lat: currentLocation.lat + 0.01 }
            if (this.checkWall(newLocation)) { return }
            this.map.Overlays.remove(this.player)
            this.player = new window.longdo.Rectangle(newLocation, {
              width: 0.015, height: 0.015
            }, {
              weight: 10,
              texture: require('@/assets/characters/player/up.png')
            })
            this.map.Overlays.add(this.player)
          }
          if (e.key === 'j') {
            newLocation = { lon: currentLocation.lon - 0.01, lat: currentLocation.lat }
            if (this.checkWall(newLocation)) { return }
            this.map.Overlays.remove(this.player)
            this.player = new window.longdo.Rectangle(newLocation, {
              width: 0.015, height: 0.015
            }, {
              weight: 10,
              texture: require('@/assets/characters/player/left.png')
            })
            this.map.Overlays.add(this.player)
          }
          if (e.key === 'k') {
            newLocation = { lon: currentLocation.lon, lat: currentLocation.lat - 0.01 }
            if (this.checkWall(newLocation)) { return }
            this.map.Overlays.remove(this.player)
            this.player = new window.longdo.Rectangle(newLocation, {
              width: 0.015, height: 0.015
            }, {
              weight: 10,
              texture: require('@/assets/characters/player/down.png')
            })
            this.map.Overlays.add(this.player)
          }
          if (e.key === 'l') {
            newLocation = { lon: currentLocation.lon + 0.01, lat: currentLocation.lat }
            if (this.checkWall(newLocation)) { return }
            this.map.Overlays.remove(this.player)
            this.player = new window.longdo.Rectangle(newLocation, {
              width: 0.015, height: 0.015
            }, {
              weight: 10,
              texture: require('@/assets/characters/player/right.png')
            })
            this.map.Overlays.add(this.player)
          }

          if (!newLocation) {
            return
          }
          
          if (window.longdo.Util.contains({ lon: newLocation.lon + 0.007, lat: newLocation.lat - 0.01 }, this.teleportA.location())) {
            this.map.Overlays.remove(this.player)
            newLocation = { lon: 101.028545, lat: 13.586281 }
            this.teleportTo(newLocation)
          }
          if (window.longdo.Util.contains({ lon: newLocation.lon + 0.007, lat: newLocation.lat - 0.01 }, this.teleportB.location())) {
            this.map.Overlays.remove(this.player)
            newLocation = { lon: 100.613468, lat: 13.531546 }
            this.teleportTo(newLocation)
          }
          
          this.map.location(newLocation)

          this.canWalk = true
        }, 200)
      })
    },
    checkWall (newLocation) {
      if (window.longdo.Util.contains({ lon: newLocation.lon + 0.007, lat: newLocation.lat - 0.01 }, this.wallArea.location())) {
        this.canWalk = true
        return true
      }
      return false
    },
    teleportTo (newLocation) {
      this.player = new window.longdo.Rectangle(newLocation, {
        width: 0.015, height: 0.015
      }, {
        weight: 10,
        texture: require('@/assets/characters/player/down.png')
      })
      this.map.location(newLocation, false)
      this.map.Overlays.add(this.player)
    },
    setupNpc () {
      let self = this
      let npc = new window.longdo.Rectangle({
        lon: 100.636813, lat: 13.508179
      }, {
        width: 0.015, height: 0.015
      }, {
        weight: 5,
        texture: require('@/assets/characters/npc/down.png')
      })
      self.map.Overlays.add(npc)
      
      let click = new window.longdo.Rectangle({
        lon: 100.636813, lat: 13.508179
      }, {
        width: 0.03, height: 0.015
      }, {
        fillColor: 'rgba(0, 0, 0, 0)',
        lineColor: 'rgba(0, 0, 0, 0)',
        weight: 5,
        popup: {
          html:
          `<div class="dialog">
            <div class="dialog-avatar">
              <img src="${require('@/assets/characters/npc/down.png')}" />
            </div>
            <div class="dialog-content">
              <div>
                <div class="dialog-content-title">แมว</div>
                <div class="dialog-content-detail">เมี้ยววววว เมี้ยวววววววว</div>
              </div>
              <div class="dialog-content-button">
                <button onclick="dismissPopup()">ปิด</button>
              </div>
            </div>
          </div>`
        }
      })
      self.map.Overlays.add(click)
    },
    setupTeleportPortal () {
      let self = this
      this.teleportA = new window.longdo.Rectangle({
        lon: 100.615871, lat: 13.537220
      }, {
        width: 0.01, height: 0.01
      }, {
        fillColor: 'rgba(0, 0, 0, 0)',
        lineColor: 'rgba(0, 0, 0, 0)',
      })
      this.teleportB = new window.longdo.Rectangle({
        lon: 101.029918, lat: 13.570930
      }, {
        width: 0.015, height: 0.015
      }, {
        fillColor: 'rgba(0, 0, 0, 0)',
        lineColor: 'rgba(0, 0, 0, 0)',
      })
      self.map.Overlays.add(this.teleportB)
    },
    setupPlant () {
      let self = this
      let click = new window.longdo.Rectangle({
        lon: 100.613124, lat: 13.592
      }, {
        width: 0.015, height: 0.015
      }, {
        fillColor: 'rgba(0, 0, 0, 0)',
        lineColor: 'rgba(0, 0, 0, 0)',
        weight: 5,
        popup: {
          html:
          `<div class="dialog">
            <div class="dialog-avatar">
              <img src="${require('@/assets/etc/item.png')}" />
            </div>
            <div class="dialog-content">
              <div>
                <div class="dialog-content-title">ปลูกผักหรือไม่?</div>
                <div class="dialog-content-detail"></div>
              </div>
              <div class="dialog-content-button">
                <button onclick="plant()">ปลูก</button>
                <button onclick="dismissPopup()">ปิด</button>
              </div>
            </div>
          </div>`
        }
      })
      self.map.Overlays.add(click)
      
      this.item = new window.longdo.Rectangle({
        lon: 100.613124, lat: 13.592
      }, {
        width: 0.015, height: 0.015
      }, {
        texture: require('@/assets/etc/crop.png')
      })
      self.map.Overlays.add(this.item)
    },
    setupWall () {
      this.wallArea = new window.longdo.Rectangle({
        lon: 100.662906, lat: 13.672464
      }, {
        lon: 100.779636, lat: 13.555578
      }, {
        fillColor: 'rgba(0, 0, 0, 0)',
        lineColor: 'rgba(0, 0, 0, 0)',
      })
      this.map.Overlays.add(this.wallArea)
    }
  }
}
</script>

<style>
.ldmap_tile {
  background-color: black;
}
.dialog {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}
.dialog-avatar {
  width: 30%;
}
.dialog-avatar > img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.dialog-content {
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.dialog-content .dialog-content-title {
  padding-bottom: 10px;
  font-size: 2rem;
  font-weight: bold;
}
.dialog-content .dialog-content-detail {
  font-size: 1rem;
}
.dialog-content .dialog-content-button {
  width: 100%;
  text-align: right;
}
.dialog-content button {
  width: 40px;
}
.ldmap_popup_mini {
  background-color: wheat !important;
  width: 60% !important;
  height: 25% !important;
  bottom: 20px !important;
  left: 20% !important;
  border: 0 !important;
  overflow: hidden !important;
  border-radius: 20px !important;
  padding: 10px;
}
</style>