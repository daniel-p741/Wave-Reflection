window.onload = function () {
    const container = document.querySelector('#canvas-container');

    let clock = new THREE.Clock();

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0xabcdef);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Adjust the camera position for a better side view
    camera.position.set(10, 1, 11.2);  // X-axis: 10 units, Y-axis: 5 units up, Z-axis: 10 units forward

    // Have the camera look at the center of the surface
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.fov = 75;
    camera.updateProjectionMatrix();

    const renderer = new THREE.WebGLRenderer({ antialias: true });

    //renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    const surfaceGeometry = new THREE.BoxGeometry(20, 4, 20);

    const surfaceMaterial = new THREE.MeshBasicMaterial({
        color: 0x5555FF,
        side: THREE.DoubleSide
    });

    const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
    //surface.rotation.x = -Math.PI / 2;
    surface.position.y = -4;
    surface.rotation.y = 2.285;

    scene.add(surface);


    function animate() {
        const delta = clock.getDelta();

        renderer.render(scene, camera);

        requestAnimationFrame(animate);
    }

    animate();

    const incidentRay = new THREE.ArrowHelper(new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 0, 0), 5, 0xff0000);
    scene.add(incidentRay);

    const reflectedRay = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 5, 0x00ff00);
    scene.add(reflectedRay);




}