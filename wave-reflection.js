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

    document.getElementById("noroughnessbutton").addEventListener("click", function () {
        sheetMaterial.roughness = 0;
    });

    document.getElementById("roughnessbutton").addEventListener("click", function () {
        sheetMaterial.roughness = 1;
    });


    let sheetGeometry = new THREE.PlaneGeometry(10, 11, 10);

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

    let initial_light = new THREE.ArrowHelper(new THREE.Vector3(1, -1, 0), new THREE.Vector3(line.position.x - .05, 3, 0), 5, 0xffff00);

    let reflected_light = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 0), new THREE.Vector3(line.position.x + .05, -2, 0), 5, 0xffff00);

    scene.add(initial_light, reflected_light);

    let slider = document.getElementById("incidentAngle");
    let angleValue = document.getElementById("angleValue");

    slider.oninput = function () {
        let angle = this.value;
        angleValue.textContent = angle; // update the displayed angle value
    };



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