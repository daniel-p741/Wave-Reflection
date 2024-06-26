let duplicates = []; // Array to store the duplicate ArrowHelpers
let angle = 0; // Initial angle value
window.onload = function () {
    const container = document.querySelector('#canvas-container');
    const loader = new THREE.GLTFLoader();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xabcdef, 1);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Increase ambient light intensity
    scene.add(ambientLight);

    const light = new THREE.PointLight(0xFFFFFF, 2, 100); // Increase point light intensity
    light.position.set(10, 10, 16);
    scene.add(light);

    let sheetMaterial = new THREE.MeshStandardMaterial({
        //silver
        color: 0x888888,
        metalness: .60,
        roughness: 0,
        side: THREE.DoubleSide
    });



    document.getElementById("roughnessbutton").addEventListener("click", function () {
        sheetMaterial.roughness = 1;
    });


    let sheetGeometry = new THREE.PlaneGeometry(9, 10, 10);

    let sheet = new THREE.Mesh(sheetGeometry, sheetMaterial);

    sheet.position.y = -2;

    sheet.rotation.x = Math.PI / 2;
    scene.add(sheet);




    // Calculate the height of the visible area at the position of the camera
    //var aspect = window.innerWidth / window.innerHeight;
    var vFOV = camera.fov * Math.PI / 180; // convert vertical fov to radians
    var height = 2 * Math.tan(vFOV / 2) * camera.position.z; // visible height

    // Calculate the y-coordinate of the top of the screen
    var topOfScreen = camera.position.y + height / 2;

    let points = [];

    points.push(new THREE.Vector3(0, topOfScreen, 0)); // Start at the top of the screen
    points.push(new THREE.Vector3(0, sheet.position.y, 0)); // End at the origin

    let geometry = new THREE.BufferGeometry().setFromPoints(points);

    let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x0000ff }));

    scene.add(line);


    initial_position = new THREE.Vector3(points[1].x, points[1].y, points[1].z)

    //let initial_light = new THREE.ArrowHelper(new THREE.Vector3(1, -1, 0), initial_position, 5, 0xffff00);
    let initial_light = new THREE.ArrowHelper(new THREE.Vector3(-1, 1, 0), initial_position, 5, 0xffff00);
    initial_light.cone.material.transparent = true;
    initial_light.cone.material.opacity = 0;

    reflected_position = new THREE.Vector3(points[1].x, points[1].y, points[1].z);
    let reflected_light = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 0), reflected_position, 5, 0xffff00);
    scene.add(initial_light, reflected_light);

    let slider = document.getElementById("incidentAngle");
    let angleValue = document.getElementById("angleValue");
    let executeByDefault = true;
    if (executeByDefault) {
        setRoughnessToZero();
    }
    document.getElementById("noroughnessbutton").addEventListener("click", setRoughnessToZero);

    roughness_flag = false;





    function setRoughnessToZero() {
        roughness_flag = false;
        sheetMaterial.roughness = 0;

        // Remove all duplicates from the scene and clear the array
        duplicates.forEach(duplicate => {
            scene.remove(duplicate);
        });
        duplicates = []; // Clear the array

        slider.value = angle; // Set the initial value of the slider to 0

        angleValue.textContent = angle + '°'; // Set the initial value of the displayed angle to 0°

        initial_light.rotation.set(0, 0, 0); // Resets the rotation for x, y, and z axes
        reflected_light.rotation.set(0, 0, 0);

        initial_light.rotation.set(0, 0, THREE.Math.degToRad(angle)); // Resets the rotation for x, y, and z axes
        reflected_light.rotation.set(0, 0, THREE.Math.degToRad(-angle));

        slider.oninput = function () {
            angle = parseFloat(this.value); // Get angle in degrees from the slider
            angleValue.textContent = angle + '°'; // Update the displayed angle value

            // Convert the angle from degrees to radians
            let angleInRadians = THREE.Math.degToRad(angle);

            // Define the axis of rotation (in this case, the z-axis)
            let axis = new THREE.Vector3(0, 0, 1);

            // Reset the rotation of the initial light
            initial_light.rotation.set(0, 0, 0);

            // Rotate the initial light counterclockwise around the z-axis
            initial_light.rotateOnAxis(axis, angleInRadians);

            // Reset the rotation of the reflected light
            reflected_light.rotation.set(0, 0, 0);

            // Rotate the reflected light clockwise around the z-axis
            reflected_light.rotateOnAxis(axis, -angleInRadians);

            reflected_light.line.material.transparent = true;
            reflected_light.line.material.opacity = 1;

            reflected_light.cone.material.transparent = true;

            reflected_light.cone.material.opacity = 1;








        };


    };

    document.getElementById("roughnessbutton").addEventListener("click", setRoughnessToTrue);

    function setRoughnessToTrue() {
        roughness_flag = true;
        sheetMaterial.roughness = 1;

        slider.value = angle; // Set the initial value of the slider to 0
        angleValue.textContent = angle + '°'; // Set the initial value of the displayed angle to 0°

        initial_light.rotation.set(0, 0, 0); // Resets the rotation for x, y, and z axes
        reflected_light.rotation.set(0, 0, 0);

        initial_light.rotation.set(0, 0, THREE.Math.degToRad(angle)); // Resets the rotation for x, y, and z axes
        reflected_light.rotation.set(0, 0, THREE.Math.degToRad(-angle));

        // Clear existing duplicates
        duplicates.forEach(duplicate => {
            scene.remove(duplicate);
        });
        duplicates = []; // Clear the array

        // Create and position duplicates
        createAndPositionDuplicates();

        // Adjust duplicates dynamically with the slider
        slider.oninput = function () {
            angle = parseFloat(this.value); // Get angle in degrees from the slider
            angleValue.textContent = angle + '°'; // Update the displayed angle value

            let angleInRadians = THREE.Math.degToRad(angle);

            // Reset and rotate initial and reflected lights
            initial_light.rotation.set(0, 0, angleInRadians);
            reflected_light.rotation.set(0, 0, -angleInRadians);

            // Update duplicates based on the new angle
            updateDuplicates(angleInRadians);
        };
    }

    function createAndPositionDuplicates() {
        for (let i = 0; i < 5; i++) {
            let randomOffset = THREE.Math.degToRad(Math.random() * 30 - 15); // Random offset within ±15 degrees
            let adjustedAngle = -THREE.Math.degToRad(angle) + randomOffset;

            let duplicate = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), reflected_position, 5, 0xffff00);
            duplicate.rotation.set(0, 0, adjustedAngle);
            scene.add(duplicate);
            duplicates.push(duplicate);
        }
    }

    function updateDuplicates(angleInRadians) {
        duplicates.forEach((duplicate, index) => {
            let randomOffset = THREE.Math.degToRad(Math.random() * 30 - 15); // Random offset within ±15 degrees
            let adjustedAngle = -angleInRadians + randomOffset;

            duplicate.rotation.set(0, 0, 0);
            duplicate.rotateOnAxis(new THREE.Vector3(0, 0, 1), adjustedAngle);
            duplicate.visible = true; // Assuming you want to always show duplicates when roughness is true

            duplicate.line.material.transparent = true;
            duplicate.line.material.opacity = 0.4;
            duplicate.cone.material.transparent = true;
            duplicate.cone.material.opacity = 0.4;
        });
    }


    //const light = new THREE.PointLight(0xFFFFFF, 1, 100);
    //light.position.set(10, 10, 10);
    //scene.add(light);

    let clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();
};