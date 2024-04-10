<template>
  <div class="login-container">
    <VScaleScreen :boxStyle="{ 'background-color': 'transparent' }" width="1920" height="1080" :delay="100">
      <div class="container-inner">
        <div class="login__form">
          <p class="title">辅助设备管控系统</p>
          <div class="body">
            <span class="cn">登录 <span class="en">sign in</span></span>
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="0" class="demo-ruleForm" status-icon
              size="large">
              <el-form-item label="" prop="username">
                <el-input v-model="ruleForm.username">
                  <template #prepend>
                    <div class="login-icon user"></div>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="" prop="password" style="margin-top: 36px">
                <el-input type="password" v-model="ruleForm.password" show-password>
                  <template #prepend>
                    <div class="login-icon password"></div>
                  </template>
                </el-input>
              </el-form-item>
            </el-form>
            <div class="submitBtn" v-loading="processing" @click="submitForm(ruleFormRef)">
              登录
            </div>
          </div>
        </div>
      </div>
    </VScaleScreen>
  </div>
</template>

<script setup lang="ts">
import { userStore } from "@/store/index";
import VScaleScreen from "v-scale-screen";
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage as createMessage } from "element-plus";
import { router } from "@/router";

const useUserStore = userStore();
const processing = ref(false);

const ruleFormRef = ref<FormInstance>();

interface RuleForm {
  username: string
  password: string
}

const ruleForm = reactive<RuleForm>({
  username: "",
  password: "",
});

const validateUsername = (_rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入用户名"));
  } else {
    callback();
  }
};
const check = /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])|(?=.*[a-z])(?=.*[A-Z])(?=.*[!@;:])|(?=.*[A-Z])(?=.*[0-9])(?=.*[!@;:])|(?=.*[a-z])(?=.*[0-9])(?=.*[!@;:]))/;
const validatePassword = (_rule: any, value: any, callback: any) => {

  if (value === "") {
    callback(new Error("请输入密码"));
  } else if (value.length < 8) {
    callback(new Error("用户密码不得小于8位"));
  } else if (!check.test(value)) {
    callback(new Error("密码应为大写字母、小写字母、数字、特殊字符中三种或三种以上的组合"));
  } else {
    callback();
  }
};
const rules = reactive<FormRules<RuleForm>>({
  username: [{ validator: validateUsername, trigger: "change" }],
  password: [{ validator: validatePassword, trigger: "change" }],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl || processing.value) return;
  try {
    await formEl.validate();
    const { username, password } = ruleForm;
    processing.value = true;
    await useUserStore.login(username, password);
    const routes = await useUserStore.getUserAuthRoute()
    let path = '/'
    if (routes.length) {
      const first = routes[0] as any
      if (first.children && first.children.length) {
        path = `/home/${first.path}/${first.children[0].path}`
      } else {
        path = `/home/${first.path}`
      }
    }
    router.push(path);
    createMessage.success("登录成功");
  } catch (error) {
    console.log("error submit!", error);
  } finally {
    processing.value = false;
  }

  // await formEl.validate(async (valid, fields) => {
  //   if (valid) {
  //     const { username, password } = ruleForm;
  //     processing.value = true
  //     await useUserStore.login(username, password);
  //     createMessage.success("登录成功");
  //     router.replace("/");
  //   } else {
  //     console.log("error submit!", fields);
  //   }
  // });
};
</script>

<style lang="scss" scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background-image: url(@/assets/images/login_bg1.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;

  .container-inner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    position: relative;

    .login-logo {
      width: 350px;
      height: 117px;
      position: absolute;
      left: 48px;
      top: 48px;
      display: flex;
      justify-content: space-between;
      flex-direction: column;

      .logo-1 {
        height: 61px;
        width: 200px;
        // background-image: url(@/assets/images/login_logo.png);
        background-size: cover;
        background-repeat: no-repeat;
      }

      .logo-2 {
        width: 100%;
        height: 53px;

        .cn {
          width: 100%;
          height: 36px;
          font-size: 24px;
          font-family: Source Han Sans CN-Regular, Source Han Sans CN;
          font-weight: 400;
          color: #ffffff;
          line-height: 28px;
          letter-spacing: 8.5px;
          text-align: end;
        }

        .en {
          height: 20px;
          font-size: 10px;
          font-family: Adobe Song Std-L, Adobe Song Std;
          font-weight: normal;
          color: #ffffff;
          line-height: 12px;
          text-align: end;
        }
      }
    }

    .login__form {
      width: 954px;
      height: 718px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;

      .title {
        height: 118px;
        font-size: 80px;
        font-family: Source Han Sans CN-Bold, Source Han Sans CN;
        font-weight: bold;
        line-height: 118px;
        letter-spacing: 6px;
        text-shadow: 4px 4px 8px rgba(45, 115, 227, 0.25);
        background: linear-gradient(180deg, #ffffff 12%, #00b6ff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
      }

      .body {
        display: flex;
        flex-direction: column;
        height: 574px;
        width: 577px;
        background-image: url(@/assets/images/login_bg2.png);
        background-size: cover;
        background-repeat: no-repeat;
        padding: 100px 70px 110px 70px;

        .cn {
          font-size: 32px;
          font-family: Source Han Sans CN-Regular, Source Han Sans CN;
          font-weight: 400;
          color: #ffffff;
          line-height: 38px;
          margin-bottom: 28px;
        }

        .en {}

        .login-icon {
          height: 32px;
          width: 32px;
          background-image: url(@/assets/images/login_user.png);
        }

        .password {
          background-image: url(@/assets/images/login_password.png);
        }

        .submitBtn {
          width: 440px;
          height: 60px;
          background: linear-gradient(180deg, #24bfed 0%, #369ef8 100%);
          border-radius: 4px 4px 4px 4px;
          line-height: 60px;
          text-align: center;
          font-size: 24px;
          color: #fff;
          margin-top: 72px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.login-container {
  .el-input__inner {
    height: 60px;
    font-size: 22px;
  }

  .el-input__suffix {
    font-size: 22px;
  }

  .el-input-group__prepend {
    background-color: #052366;
    border: 1px solid;
    box-shadow: none;
  }
}
</style>
