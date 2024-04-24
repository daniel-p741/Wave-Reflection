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


    //document.getElementById("silverbutton").addEventListener("click", function () {
    //    sheetMaterial.color.setHex(0x888888);
    //    sheetMaterial.metalness = 0.5;
    //    sheetMaterial.roughness = 0.5;
    //    sheetMaterial.needsUpdate = true;
    //});



    let sheetGeometry = new THREE.PlaneGeometry(10, 11, 10);






    let sheet = new THREE.Mesh(sheetGeometry, sheetMaterial);

    sheet.position.y = -2;

    sheet.rotation.x = Math.PI / 2;
    scene.add(sheet);


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