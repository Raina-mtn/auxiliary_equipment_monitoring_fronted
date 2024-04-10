const hcCameraController = new HcCameraController({
  ele: "iframe_camera",
});
const iframe_camera = ref();

const iframeLoad = () => {
  // setEquipment()
  // getCfg();
  // setCameraApi()
  setCameras();
};

// 设置设备
const setEquipment = async () => {
  let equipment = [
    {
      robotcode: "1001",
      robotname: "硬盘录像机1001",
      robottype: "9",
      stationname: "环网柜测试部",
      vcameraip: "172.16.190.101",
      vcameraport: 80,
      vcameraname: "admin",
      vcamerapwd: "shenhao123",
      icameraport: 8000,
      cnDesc: "硬盘录像机1001主",
      equipmentMode: "HK",
      manufacturer: "海康",
      manufacturerCountry: "滨江",
      serialDate: "2022-05-08 15:38:00",
      physicalId: "1001",
      instalPosition: "机架",
      onlineState: 1,
      substationId: 1000000001,
      x: 12,
      y: 123,
      z: 0,
    },
    {
      robotcode: "10011",
      robotname: "硬盘录像机10011",
      robottype: "9",
      stationname: "环网柜测试部",
      vcameraip: "172.16.190.102",
      vcameraport: 80,
      vcameraname: "admin",
      vcamerapwd: "shenhao123",
      icameraport: 8000,
      cnDesc: "硬盘录像机1001备",
      equipmentMode: "HK",
      manufacturer: "IPC",
      manufacturerCountry: "位置",
      serialDate: "2022-05-08 15:38:00",
      physicalId: "10011",
      instalPosition: "实验室机架",
      onlineState: 1,
      substationId: 1000000001,
      x: 12,
      y: 123,
      z: 0,
    },
    {
      robotcode: "1002",
      robotname: "硬盘录像机1002",
      robottype: "9",
      stationname: "环网柜测试部",
      vcameraip: "172.16.190.103",
      vcameraport: 80,
      vcameraname: "admin",
      vcamerapwd: "shenhao123",
      icameraport: 8000,
      cnDesc: "硬盘录像机1002主",
      equipmentMode: "HK",
      manufacturer: "大华",
      manufacturerCountry: "杭州",
      serialDate: "2022-05-08 15:38:00",
      physicalId: "1002",
      instalPosition: "申昊实验室",
      onlineState: 1,
      substationId: 1000000001,
      x: 12,
      y: 123,
      z: 0,
    },
    {
      robotcode: "10021",
      robotname: "硬盘录像机10021",
      robottype: "9",
      stationname: "环网柜测试部",
      vcameraip: "172.16.190.104",
      vcameraport: 80,
      vcameraname: "admin",
      vcamerapwd: "shenhao123",
      icameraport: 8000,
      cnDesc: "硬盘录像机1002备",
      equipmentMode: "HK",
      manufacturer: "申昊",
      manufacturerCountry: "余杭",
      serialDate: "2022-05-08 15:38:00",
      physicalId: "10021",
      instalPosition: "申昊实验室",
      onlineState: 1,
      substationId: 1000000001,
      x: 12,
      y: 123,
      z: 0,
    },
    {
      robotcode: "1003",
      robotname: "硬盘录像机1003",
      robottype: "9",
      stationname: "环网柜测试部",
      vcameraip: "172.16.190.105",
      vcameraport: 80,
      vcameraname: "admin",
      vcamerapwd: "shenhao123",
      icameraport: 8000,
      cnDesc: "硬盘录像机1003主",
      equipmentMode: "HK",
      manufacturer: "小米",
      manufacturerCountry: "北京",
      serialDate: "2022-05-08 15:38:00",
      physicalId: "1003",
      instalPosition: "实验室入口",
      onlineState: 1,
      substationId: 1000000001,
      x: 12,
      y: 123,
      z: 0,
    },
    {
      robotcode: "10031",
      robotname: "硬盘录像机10031",
      robottype: "9",
      stationname: "环网柜测试部",
      vcameraip: "172.16.190.106",
      vcameraport: 80,
      vcameraname: "admin",
      vcamerapwd: "shenhao123",
      icameraport: 8000,
      cnDesc: "硬盘录像机1003备",
      equipmentMode: "HK",
      manufacturer: "海思",
      manufacturerCountry: "深圳",
      serialDate: "2022-05-08 15:38:00",
      physicalId: "10031",
      instalPosition: "申昊实验室",
      onlineState: 1,
      substationId: 1000000001,
      x: 12,
      y: 123,
      z: 0,
    },
    {
      robotcode: "1004",
      robotname: "硬盘录像机1004",
      robottype: "9",
      stationname: "环网柜测试部",
      vcameraip: "172.16.190.107",
      vcameraport: 80,
      vcameraname: "admin",
      vcamerapwd: "shenhao123",
      icameraport: 8000,
      cnDesc: "硬盘录像机1004主",
      equipmentMode: "HK",
      manufacturer: "TI",
      manufacturerCountry: "未知",
      serialDate: "2022-05-08 15:38:00",
      physicalId: "1004",
      instalPosition: "实验室支架",
      onlineState: 1,
      substationId: 1000000001,
      x: 12,
      y: 123,
      z: 0,
    },
    {
      robotcode: "10041",
      robotname: "硬盘录像机10041",
      robottype: "9",
      stationname: "环网柜测试部",
      vcameraip: "172.16.190.108",
      vcameraport: 80,
      vcameraname: "admin",
      vcamerapwd: "shenhao123",
      icameraport: 8000,
      cnDesc: "硬盘录像机1004备",
      equipmentMode: "HK",
      manufacturer: "研华",
      manufacturerCountry: "中国",
      serialDate: "2022-05-08 15:38:00",
      physicalId: "10041",
      instalPosition: "申昊实验室",
      onlineState: 1,
      substationId: 1000000001,
      x: 12,
      y: 123,
      z: 0,
    },
  ];

  // 设置设备
  const equipmentDataList = equipment.map(
    ({ vcameraip, vcameraport, vcameraname, vcamerapwd, ...data }) => ({
      ip: vcameraip,
      port: vcameraport,
      username: vcameraname,
      password: vcamerapwd,
      data,
    })
  );
  hcCameraController.setOptions({
    equipments: equipmentDataList,
  });

  await hcCameraController.initPlugin();
  listenSize();
  await pending(500);
  await hcCameraController.setWnd(2);
  await pending(1000);
  await hcCameraController.getCameraByEquipment();
};

// 设置相机
const setCameras = async () => {
  let cameras = [
    {
      robotcode: "1001",
      robotname: "硬盘录像机1001",
      robottype: "9",
      stationname: "环网柜测试部",
      vcameraip: "172.16.190.101",
      vcameraport: 80,
      vcameraname: "admin",
      vcamerapwd: "shenhao123",
      icameraport: 8000,
      cnDesc: "硬盘录像机1001主",
      equipmentMode: "HK",
      manufacturer: "海康",
      manufacturerCountry: "滨江",
      serialDate: "2022-05-08 15:38:00",
      physicalId: "1001",
      instalPosition: "机架",
      onlineState: 1,
      substationId: 1000000001,
      x: 12,
      y: 123,
      z: 0,
      channel: "1",
    },
    {
      robotcode: "1001",
      robotname: "硬盘录像机1001",
      robottype: "9",
      stationname: "环网柜测试部",
      vcameraip: "172.16.190.101",
      vcameraport: 80,
      vcameraname: "admin",
      vcamerapwd: "shenhao123",
      icameraport: 8000,
      cnDesc: "硬盘录像机1001主",
      equipmentMode: "HK",
      manufacturer: "海康",
      manufacturerCountry: "滨江",
      serialDate: "2022-05-08 15:38:00",
      physicalId: "1001",
      instalPosition: "机架",
      onlineState: 1,
      substationId: 1000000001,
      x: 12,
      y: 123,
      z: 0,
      channel: "2",
    },
    {
      robotcode: "1001",
      robotname: "硬盘录像机1001",
      robottype: "9",
      stationname: "环网柜测试部",
      vcameraip: "172.16.190.101",
      vcameraport: 80,
      vcameraname: "admin",
      vcamerapwd: "shenhao123",
      icameraport: 8000,
      cnDesc: "硬盘录像机1001主",
      equipmentMode: "HK",
      manufacturer: "海康",
      manufacturerCountry: "滨江",
      serialDate: "2022-05-08 15:38:00",
      physicalId: "1001",
      instalPosition: "机架",
      onlineState: 1,
      substationId: 1000000001,
      x: 12,
      y: 123,
      z: 0,
      channel: "3",
    },
    {
      robotcode: "1001",
      robotname: "硬盘录像机1001",
      robottype: "9",
      stationname: "环网柜测试部",
      vcameraip: "172.16.190.101",
      vcameraport: 80,
      vcameraname: "admin",
      vcamerapwd: "shenhao123",
      icameraport: 8000,
      cnDesc: "硬盘录像机1001主",
      equipmentMode: "HK",
      manufacturer: "海康",
      manufacturerCountry: "滨江",
      serialDate: "2022-05-08 15:38:00",
      physicalId: "1001",
      instalPosition: "机架",
      onlineState: 1,
      substationId: 1000000001,
      x: 12,
      y: 123,
      z: 0,
      channel: "4",
    },
    {
      robotcode: "1001",
      robotname: "硬盘录像机1001",
      robottype: "9",
      stationname: "环网柜测试部",
      vcameraip: "172.16.190.101",
      vcameraport: 80,
      vcameraname: "admin",
      vcamerapwd: "shenhao123",
      icameraport: 8000,
      cnDesc: "硬盘录像机1001主",
      equipmentMode: "HK",
      manufacturer: "海康",
      manufacturerCountry: "滨江",
      serialDate: "2022-05-08 15:38:00",
      physicalId: "1001",
      instalPosition: "机架",
      onlineState: 1,
      substationId: 1000000001,
      x: 12,
      y: 123,
      z: 0,
      channel: "5",
    },
    {
      robotcode: "1001",
      robotname: "硬盘录像机1001",
      robottype: "9",
      stationname: "环网柜测试部",
      vcameraip: "172.16.190.101",
      vcameraport: 80,
      vcameraname: "admin",
      vcamerapwd: "shenhao123",
      icameraport: 8000,
      cnDesc: "硬盘录像机1001主",
      equipmentMode: "HK",
      manufacturer: "海康",
      manufacturerCountry: "滨江",
      serialDate: "2022-05-08 15:38:00",
      physicalId: "1001",
      instalPosition: "机架",
      onlineState: 1,
      substationId: 1000000001,
      x: 12,
      y: 123,
      z: 0,
      channel: "6",
    },
    {
      robotcode: "1001",
      robotname: "硬盘录像机1001",
      robottype: "9",
      stationname: "环网柜测试部",
      vcameraip: "172.16.190.101",
      vcameraport: 80,
      vcameraname: "admin",
      vcamerapwd: "shenhao123",
      icameraport: 8000,
      cnDesc: "硬盘录像机1001主",
      equipmentMode: "HK",
      manufacturer: "海康",
      manufacturerCountry: "滨江",
      serialDate: "2022-05-08 15:38:00",
      physicalId: "1001",
      instalPosition: "机架",
      onlineState: 1,
      substationId: 1000000001,
      x: 12,
      y: 123,
      z: 0,
      channel: "7",
    },
    {
      robotcode: "1001",
      robotname: "硬盘录像机1001",
      robottype: "9",
      stationname: "环网柜测试部",
      vcameraip: "172.16.190.101",
      vcameraport: 80,
      vcameraname: "admin",
      vcamerapwd: "shenhao123",
      icameraport: 8000,
      cnDesc: "硬盘录像机1001主",
      equipmentMode: "HK",
      manufacturer: "海康",
      manufacturerCountry: "滨江",
      serialDate: "2022-05-08 15:38:00",
      physicalId: "1001",
      instalPosition: "机架",
      onlineState: 1,
      substationId: 1000000001,
      x: 12,
      y: 123,
      z: 0,
      channel: "8",
    },
  ];
  const cameraDataList = cameras.map(
    ({
      vcameraip,
      vcameraport,
      vcameraname,
      vcamerapwd,
      channel,
      ...data
    }) => ({
      ip: vcameraip,
      port: vcameraport,
      username: vcameraname,
      password: vcamerapwd,
      channel,
      data,
    })
  );
  hcCameraController.setOptions({
    cameras: cameraDataList,
  });

  await hcCameraController.initPlugin();
  listenSize();
  await pending(500);
  await hcCameraController.setWnd(2);
  await pending(1000);
  await hcCameraController.getPluginCfg();
  await hcCameraController.startPlayCameraList();
};


// 请求获取相机
const setCameraApi = async () => {
  const getListByApi = async ({ pageIndex, pageSize }) => {
    const res = await getCameras({
      page: { pageIndex, pageSize },
      robotCode: 1,
    });
    console.log("res>>>>", res);
    let cameraListData = res.data.map(
      ({
        vcameraip,
        vcameraport,
        vcameraname,
        vcamerapwd,
        channel,
        ...data
      }) => ({
        ip: vcameraip,
        port: vcameraport,
        username: vcameraname,
        password: vcamerapwd,
        channel,
        data,
      })
    );
    return { playList: cameraListData, total: res.totalCount };
  };
  hcCameraController.setOptions({
    getList: getListByApi,
  });

  await hcCameraController.initPlugin();
  listenSize();
  await pending(500);
  await hcCameraController.setWnd(2);
  await pending(1000);
  await hcCameraController.getPluginCfg();
  await hcCameraController.startPlayCameraList();
};

const getCfg = async () => {
  await hcCameraController.initPlugin();
  listenSize();
  await pending(500);
  await hcCameraController.setWnd(2);
  hcCameraController.getPluginCfg();
};

// 监听
const listenSize = () => {
  // 监听变化
  const observer = new ResizeObserver((entries, observer) => {
    entries.forEach((entry) => {
      resize();
    });
  });

  const resize = debounce(() => {
    const {
      width,
      height,
      x = 0,
      y = 0,
    } = iframe_camera.value.getBoundingClientRect();
    hcCameraController.resize({
      width: Math.round(width),
      height: Math.round(height),
      left: Math.round(x),
      top: Math.round(y),
    });
  }, 800);
  const test = document.getElementById("rootScreen") as Element;
  observer.observe(test);
};