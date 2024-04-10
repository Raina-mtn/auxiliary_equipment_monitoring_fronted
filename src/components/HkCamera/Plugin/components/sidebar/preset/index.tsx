/*
 * @Date: 2023-08-04 13:21:18
 * @LastEditors: zhusisheng zhusisheng@shenhaoinfo.com
 * @LastEditTime: 2023-08-08 15:26:48
 * @FilePath: \robot_outdoor_e_vue3\src\components\HcCamera\components\sidebar\preset\index.tsx
 */
import {
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  defineProps,
} from "vue";
import { getPresetList, deletePreset } from "@/api/interface";
import Form from "./form.vue";
import "./index.scss";
import { ElMessage } from 'element-plus'

export default defineComponent({
  props: {
    hcCameraController: Object,
  },
  setup(props) {
    watch(
      () => props.hcCameraController?.reactiveData.choosedCamrea,
      async (choosedCamrea) => {
        if (!choosedCamrea) return;
        console.log("choosedCamrea", choosedCamrea);
        setPresetList();
      },
      { immediate: true }
    );

    const list = ref([]);
    const setPresetList = async () => {
      const { ip } = props.hcCameraController?.reactiveData.choosedCamrea.equipment;
      const { channel } = props.hcCameraController?.reactiveData.choosedCamrea
      list.value = await getPresetList({
        presetip: ip,
        presetchannel: channel,
      }).then((res) => res.data);
    };


    const deletePresetFun = (item) => {
      const { ip } = props.hcCameraController?.reactiveData.choosedCamrea.equipment;
      const { channel } = props.hcCameraController?.reactiveData.choosedCamrea;
      const data = {
        presetindex: item.presetindex,
        presetip: ip,
        presetchannel: channel
      }
      deletePreset(data).then(res => {
        setPresetList();
        ElMessage.success("删除成功");
      })
    }

    return () => (
      <div class={"preset"}>
        <div class={"title"}>
          <p>
            {props.hcCameraController?.reactiveData?.choosedCamrea?.data.cnDesc}
          </p>
          <Form
            getList={setPresetList}
            formData={{
              presetip:
                props.hcCameraController?.reactiveData.choosedCamrea
                  ?.equipment?.ip,
              presetchannel:
                props.hcCameraController?.reactiveData.choosedCamrea
                  ?.channel,
              presetindex: 0,
              presetname: '',
            }}

          >
            <el-button
              disabled={!props.hcCameraController?.reactiveData.choosedCamrea}
              size="small">添加</el-button>
          </Form>
        </div>
        <div class={"body"}>
          {list.value.map((item, index) => (
            <div class={"body-item"}>
              <p class={"item-desc"}>{item?.presetname}</p>
              <div
                class={"item-btn"}
                onClick={async () => {
                  await props.hcCameraController?.reactiveData.choosedCamrea.goPreset(
                    item.presetindex
                  )
                  ElMessage.success("调用成功");
                }
                }
              />
              <Form
                getList={setPresetList}
                formData={{
                  presetip:
                    props.hcCameraController?.reactiveData.choosedCamrea
                      .equipment.ip,
                  presetchannel:
                    props.hcCameraController?.reactiveData.choosedCamrea
                      .channel,
                  presetindex: item?.presetindex,
                  presetname: item?.presetname,
                }}
              >
                <div class={"item-btn"} />
              </Form>
              <el-popconfirm
                onConfirm={() => deletePresetFun(item)}
                title="是否要删除？"
                v-slots={{
                  reference: () => {
                    return (
                      <>
                        <div class={"item-btn"} />
                      </>
                    )
                  }
                }} />
            </div>
          ))}
        </div>
      </div>
    );
  },
});
