/*
 * @Date: 2023-07-03 16:55:44
 * @LastEditors: zhusisheng zhusisheng@shenhaoinfo.com
 * @LastEditTime: 2023-07-17 16:19:38
 * @FilePath: \robot_outdoor_e_vue3\src\store\modules\user.ts
 */

import { defineStore } from "pinia";
import { ElMessage as createMessage } from 'element-plus'

export const alarmStore = defineStore({
    id: 'alarm', // 必须指明唯一的pinia仓库的id
    state: () => ({
        equipmentId:null,
        checkList:[], // 选中的结点列表
        dialogVisible: false
    }),
    actions: {
        async setEquipmentId(equipmentId) {
            this.equipmentId = equipmentId
        },
        async setCheckList(checkList) {
            this.checkList = checkList
            this.equipmentId = checkList[0].id
            console.log('this.equipmentId store :>> ', this.equipmentId);

        },
        async setDialogVisible(dialogVisible) {
            this.dialogVisible = dialogVisible
            console.log('this.dialogVisible :>> ', this.dialogVisible);
        }
    },
    getters: {
    }
})
