import * as THREE from "three" // Importing the THREE.js library to create 3D scenes
import './style.css' // Importing the CSS file for styling
import gsap from "gsap" // Importing the GSAP library for animations
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls" // Importing OrbitControls to control the camera view with the mouse

// Create a scene, which is like the world where everything happens
const scene = new THREE.Scene()

// Create a sphere (a 3D ball)
// The numbers 3, 64, and 64 mean:
// 3 is the size of the ball, and 64, 64 are how smooth the ball is (more segments make it smoother)
const geometry = new THREE.SphereGeometry(3, 64, 64)   

// Create a material (the color and look of the ball)
// Here we make it blue with the color code '#0088f3'
const material = new THREE.MeshStandardMaterial({
  color: '#0088f3',
})

// Combine the sphere shape (geometry) and the color/look (material) to create a 3D object
const mesh = new THREE.Mesh(geometry, material)

// Add the ball to the scene so we can see it
scene.add(mesh)

// Get the size of the screen (window) so we can make everything fit nicely
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Create a light so we can see the ball (just like in real life, we need light to see things)
// The numbers 0xffffff mean it's a white light, and the other numbers control how strong it is and how far it reaches
const light = new THREE.PointLight(0xffffff, 80, 100, 1.7);
light.position.set(0, 10, 10) // Position the light in the scene
scene.add(light); // Add the light to the scene

// Create a camera so we can look at the scene
// The numbers here help set up how the camera sees things
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 20 // Move the camera back so we can see the whole ball
scene.add(camera) // Add the camera to the scene

// Create the renderer, which draws the scene so we can see it on the screen
const canvas = document.querySelector('.webgl') // Find the place (canvas) in the HTML where the scene will be shown
const renderer = new THREE.WebGLRenderer({ canvas }) // Set up the renderer to draw on the canvas
renderer.setSize(sizes.width, sizes.height) // Set the size of the renderer to match the screen
renderer.setPixelRatio(2) // Make everything look sharper
renderer.render(scene, camera) // Draw the scene for the first time

// Set up controls so we can move the camera around with the mouse
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true // Make the movement smooth
controls.enablePan = false // Disable moving the scene around with the mouse
controls.enableZoom = false // Disable zooming in and out with the mouse
controls.autoRotate = true // Make the camera automatically rotate around the ball
controls.autoRotateSpeed = 10 // Set how fast the camera rotates

// Update everything when the screen size changes (like when you resize the window)
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth; // Update the width size
  sizes.height = window.innerHeight; // Update the height size

  // Update the camera settings to match the new size
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update the renderer to match the new size
  renderer.setSize(sizes.width, sizes.height)
})

// A function that keeps running to update and redraw the scene over and over
const loop = () => {
  controls.update() // Update the camera controls
  renderer.render(scene, camera) // Redraw the scene
  window.requestAnimationFrame(loop) // Keep the loop going
}

loop() // Start the loop

// Animation sequence using GSAP to make the ball grow and some text appear
const t1 = gsap.timeline({ defaults: { duration: 1 }})
t1.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 }) // Make the ball grow from nothing to full size
t1.fromTo("nav", { y: "-100%" }, { y: "0%" }) // Slide down the navigation bar
t1.fromTo(".title", { opacity: 0 }, { opacity: 1 }) // Make the title appear

// Change the color of the ball when the mouse moves and the button is pressed
let mouseDown = false // A flag to know when the mouse button is pressed
let rgb = [] // An array to store the red, green, and blue color values
window.addEventListener("mousedown", () => { mouseDown = true }) // Set mouseDown to true when the mouse button is pressed
window.addEventListener("mouseup", () => { mouseDown = false }) // Set mouseDown to false when the mouse button is released

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    // Calculate new color values based on where the mouse is on the screen
    rgb = [
      Math.round((e.pageX / sizes.width) * 255), // Red value based on mouse X position
      Math.round((e.pageY / sizes.height) * 255), // Green value based on mouse Y position
      150, // Blue value stays constant
    ]

    // Create a new color using the calculated RGB values
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)

    // Use GSAP to smoothly change the ball's color to the new color
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    })
  }
})

