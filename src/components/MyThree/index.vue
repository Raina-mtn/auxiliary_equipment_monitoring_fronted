<template>
    <div id="my-three" ref="dom"></div>
</template>
    
<script setup lang='ts'>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onMounted, watch } from "vue";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { ElLoading } from "element-plus";


const threeObj = { // 与three相关的不做响应式，否则会导致模型加载失败
    camera: {} as THREE.PerspectiveCamera,
    scene: {} as THREE.Scene,
    controls: {} as OrbitControls,
    renderer: {} as THREE.WebGLRenderer,
    animationFrame: {},
    width: 0,
    height: 0
}
// iconData: 图标信息
const props = defineProps(['iconData', 'iconType'])
watch(() => [props.iconData, props.iconType], () => {
    setIcon(props.iconData)
})

onMounted(() => {
    const element = document.getElementById("my-three");
    threeObj.width = element!.clientWidth
    threeObj.height = element!.clientHeight
    console.log(threeObj.width);
    init()
})

const init = () => {
    const loading = ElLoading.service({
        lock: true,
        text: "Loading",
        target: '#my-three',
        background: "rgba(0, 0, 0, 0.7)"
    });
    createScene()
    createLight()

    // 创建相机
    createCamera()
    // 创建渲染器
    //创建一个WebGL渲染器
    createRender()
    // 创建控件对象
    createControls()
    // 导入模型
    let dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/static/draco/");
    dracoLoader.setDecoderConfig({ type: "js" });
    dracoLoader.preload();

    const loader = new GLTFLoader().setPath("");
    loader.setDRACOLoader(dracoLoader);
    loader.load("static/model/station_new.glb", gltf => {
        gltf.scene.position.set(0, 0, 0)
        threeObj.scene.add(gltf.scene);
        threeObj.renderer.render(threeObj.scene, threeObj.camera);
        setIcon(props.iconData)
        // nextTick(() => {
        loading.close();
        // });
    });
    document.getElementById("my-three")?.appendChild(threeObj.renderer.domElement);
};
//创建场景
const createScene = () => {
    threeObj.scene = new THREE.Scene();
    threeObj.scene.background = null;
};
// 创建光源
const createLight = () => {
    const ambientLight = new THREE.AmbientLight("#fff");
    threeObj.scene.add(ambientLight)
    const spotLight = new THREE.SpotLight("#000") as THREE.SpotLight; // 创建聚光灯
    spotLight.castShadow = true;
    threeObj.scene.add(spotLight);
    const light = new THREE.HemisphereLight(0xffeeee, 0x111122);
    threeObj.scene.add(light);
}

//创建相机
const createCamera = () => {
    threeObj.camera = new THREE.PerspectiveCamera(
        15,
        threeObj.width / threeObj.height,
        0.01,
        100000
    );
    //设置相机位置
    threeObj.camera.position.set(80, 80, 80);
    //设置相机方向
    threeObj.camera.lookAt(new THREE.Vector3(10, 10, 10));
};
// 创建渲染器
const createRender = () => {
    threeObj.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        logarithmicDepthBuffer: true
    });
    threeObj.renderer.setClearAlpha(0);
    threeObj.renderer.setSize(threeObj.width, threeObj.height); //设置渲染区尺寸
    threeObj.renderer.shadowMap.enabled = true; // 显示阴影
    threeObj.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    threeObj.renderer.render(threeObj.scene, threeObj.camera); //执行渲染操作、指定场景、相机作为参数
};

// 创建控件对象
const createControls = () => {
    threeObj.controls = new OrbitControls(threeObj.camera, threeObj.renderer.domElement); //创建控件对象
    threeObj.controls.addEventListener("change", () => {
        threeObj.renderer.render(threeObj.scene, threeObj.camera); //监听鼠标，键盘事件
    });
};

// 添加图标
const setIcon = (iconDatas: any[]) => {
    if (props.iconType) {
        let group = threeObj.scene.getObjectByName(props.iconType);
        if (!group) {
            group = new THREE.Group();
            group.name = props.iconType
        }
        console.log('set group>>>', group);

        // 根据类型id设置不同的组
        if (Array.isArray(iconDatas)) {
            iconDatas.forEach((item: any) => {
                if (item.emapX && item.emapY && item.emapZ) {
                    const img = `/src/assets/images/3dIcon/icon_${props.iconType}.png`
                    const texture = new THREE.TextureLoader().load(img,
                        (texture: THREE.Texture) => {
                            const mat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
                            const geom = new THREE.PlaneGeometry(5, 5);
                            const mesh = new THREE.Mesh(geom, mat);
                            mesh.position.set(item.emapX, item.emapY, item.emapZ);
                            mesh.updateMatrix()
                            group!.add(mesh);
                        }
                    );
                    texture.needsUpdate = true
                }
            })
            threeObj.scene.add(group!);
            setTimeout(() => {
                threeObj.renderer.render(threeObj.scene, threeObj.camera);
            }, 100)
        }
    }
};

// 删除图标
const delIcon = (name: string) => {
    const group = threeObj.scene.getObjectByName(name);
    if (group) {
        threeObj.scene.remove(group)
    }
}
defineExpose({ setIcon, delIcon })
</script>
    
<style scoped lang='scss'>
#my-three {
    width: 100%;
    height: 98%;
    margin: 0;
    padding: 0;
}
</style>