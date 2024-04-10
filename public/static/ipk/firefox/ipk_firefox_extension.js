var event_ipk_request = 'event_ipk_request';
var event_ipk_response = 'event_ipk_response';
var event_key_response = 'event_key_response';
var g_DataGet =  { action: '', responseData: '', status: '' };
var delegateFunc = null;
var Function_GetVersion = 'GetVersion';
var Function_OpenDevice = 'OpenDevice';
var Function_CloseDevice = 'CloseDevice';
var Function_VerifyPin = 'VerifyPin';
var Function_GetKeyId = 'GetKeyId';
var Function_SignData = 'SignData';
var Function_KeyRequset = 'KeyRequset';
var Function_WriteKey = 'WriteKey';
var Function_ModifyPin = 'ModifyPin';
var Function_GetPinResetReq = 'GetPinResetReq';
var Function_ResetPin = 'ResetPin';
var Function_IPKSM2Encrypt = 'IPKSM2Encrypt';
var Function_SM2Decrypt = 'SM2Decrypt';
var Function_SubscribeEvent = 'SubscribeEvent';

var MessageType = "MessageType";
var message = "message";
var result = "result";

var paramErrCode = -100;
var noStartTheExeErrCode = -101;
var otherErrCode = -102;


// function Initialize(funCallback) {
// 	var ret = false;

// 	try {
// 		if ("function" == typeof (eval(funCallback))) {
// 			delegateFunc = funCallback;
// 			ret = true;
// 		}
// 	}
// 	catch (e) {
// 		console.log(e.message);
// 	}
// 	finally {
// 		return ret;
// 	}
// }

// function Finalize() {
// 	if (null != delegateFunc) {
// 		delegateFunc = null;
// 		return true;
// 	}
// 	return false;
// }

// retValue 有两种情况的返回值
// eg1: { "messageType":"GetVersion", "tabId":"1", "Data":"XXXXXXXXXX", "Status":"0" }
// eg2: { success: false, message: "connect error" }
function ParseRetValue(retValue, retZeroWhenCorrected) {
    var ret;

	try {
        if (retValue.success != undefined) {
            if ((!retValue.success) && (retValue.message == "connect error")) {
                ret = noStartTheExeErrCode;
            }
            else {
                ret = otherErrCode;
            }
        }
        else {
			var { status, data } = retValue;
			if (status === 0) {
          if (retZeroWhenCorrected == true) {
                ret = 0;
          }
                else {
					ret = data;
                }
            }
            else {
				ret = data;
            }
        }
    }
    catch (e) {
        ret = paramErrCode;
    }

    return ret;
}

function DelayFunc(funcName, retZeroWhenCorrected) {
	window.addEventListener("message",
		function handleNativeMessage(e) {
            console.log(e)
            if (e.source != window) {
                return;
            }
			var valueTemp = e.data;
			var ret;
			ret = ParseRetValue(valueTemp, retZeroWhenCorrected);
			if (funcName == valueTemp.messageType) {
				g_DataGet.action = funcName
                g_DataGet.status = valueTemp.status
				g_DataGet.responseData = ret
                window.removeEventListener(e.type, handleNativeMessage);
            }


			// if (null != delegateFunc) {
			// 	delegateFunc({ action: funcName, responseData: ret });
			// }
			// window.removeEventListener(e.type, handleNativeMessage);
		}
		, false);
}

// ============ GetVersion function ============== 
function IsResponseVersion(value) {
	var ret = false;

	try {
		if (undefined != value &&
			undefined != value.action &&
			undefined != value.responseData &&
			Function_GetVersion == value.action) {
			ret = true;
		}
	}
	catch (e) {
		console.log(e.message);
	}
	finally {
		return ret;
	}
}
function GetVersion() {
	return new Promise(function (resolve, reject) {
        try {
			g_DataGet =  { action: '', responseData: '', status: '' };
            var input = { MessageType: Function_GetVersion };
			var event = new CustomEvent(event_ipk_request, { 'detail': input });
			window.dispatchEvent(event);
            DelayFunc(Function_GetVersion, false);
            var num = 1;
			var check = setInterval(function () {
                num = ++num;
                if (input.MessageType == g_DataGet.action) {
                    resolve(g_DataGet.responseData);
                    clearInterval(check);
                }
                if(num > 60){
                    resolve(504);
                    clearInterval(check);
                }
            }, 20);
        }
        catch (e) {
            reject(e);
        }
    });	
}
function OpenDevice(devType,vkeyFile) {
	return new Promise(function (resolve, reject) {
        try {
			g_DataGet =  { action: '', responseData: '', status: '' };
            var input = { MessageType: Function_OpenDevice, DevType: devType, VkeyFile: vkeyFile };
			var event = new CustomEvent(event_ipk_request, { 'detail': input });
			window.dispatchEvent(event);
            DelayFunc(Function_OpenDevice, false);
			var check = setInterval(function () {
                if (input.MessageType == g_DataGet.action) {
                    resolve(JSON.stringify(g_DataGet));
                    clearInterval(check);
                }
            }, 20);
        }
        catch (e) {
            reject(e);
        }
    });	
}
function CloseDevice() {
	return new Promise(function (resolve, reject) {
        try {
			g_DataGet =  { action: '', responseData: '', status: '' };
            var input = { MessageType: Function_CloseDevice};
			var event = new CustomEvent(event_ipk_request, { 'detail': input });
			window.dispatchEvent(event);
            DelayFunc(Function_CloseDevice, false);
			var check = setInterval(function () {
                if (input.MessageType == g_DataGet.action) {
                    resolve(JSON.stringify(g_DataGet));
                    clearInterval(check);
                }
            }, 20);
        }
        catch (e) {
            reject(e);
        }
    });	
}
function GetKeyId(keyIndex) {
	return new Promise(function (resolve, reject) {
        try {
			g_DataGet =  { action: '', responseData: '', status: '' };
            var input = { MessageType: Function_GetKeyId, KeyIndex: keyIndex };
			var event = new CustomEvent(event_ipk_request, { 'detail': input });
			window.dispatchEvent(event);
            DelayFunc(Function_GetKeyId, false);
			var check = setInterval(function () {
                if (input.MessageType == g_DataGet.action) {
                    resolve(JSON.stringify(g_DataGet));
                    clearInterval(check);
                }
            }, 20);
        }
        catch (e) {
            reject(e);
        }
    });	
}
function VerifyPin(userType, password) {
	return new Promise(function (resolve, reject) {
        try {
			g_DataGet =  { action: '', responseData: '', status: '' };
            var input = { MessageType: Function_VerifyPin, UserType: userType, Passwd: password };
			var event = new CustomEvent(event_ipk_request, { 'detail': input });
			window.dispatchEvent(event);
            DelayFunc(Function_VerifyPin, false);
			var check = setInterval(function () {
                if (input.MessageType == g_DataGet.action) {
                    resolve(JSON.stringify(g_DataGet));
                    clearInterval(check);
                }
            }, 20);
        }
        catch (e) {
            reject(e);
        }
    });	
}
function SignData(keyIndex, data) {
	return new Promise(function (resolve, reject) {
        try {
			g_DataGet =  { action: '', responseData: '', status: '' };
            var input = { MessageType: Function_SignData, KeyIndex: keyIndex, Data: data };
			var event = new CustomEvent(event_ipk_request, { 'detail': input });
			window.dispatchEvent(event);
            DelayFunc(Function_SignData, false);
			var check = setInterval(function () {
                if (input.MessageType == g_DataGet.action) {
                    resolve(JSON.stringify(g_DataGet));
                    clearInterval(check);
                }
            }, 20);
        }
        catch (e) {
            reject(e);
        }
    });	
}
function KeyRequset(pubMatrix, keyId) {
	return new Promise(function (resolve, reject) {
        try {
			g_DataGet =  { action: '', responseData: '', status: '' };
            var input = { MessageType: Function_KeyRequset, PubMatrix: pubMatrix, KeyId: keyId };
			var event = new CustomEvent(event_ipk_request, { 'detail': input });
			window.dispatchEvent(event);
            DelayFunc(Function_KeyRequset, false);
			var check = setInterval(function () {
                if (input.MessageType == g_DataGet.action) {
                    resolve(JSON.stringify(g_DataGet));
                    clearInterval(check);
                }
            }, 20);
        }
        catch (e) {
            reject(e);
        }
    });	
}
function WriteKey(keyIndex, keyData) {
	return new Promise(function (resolve, reject) {
        try {
			g_DataGet =  { action: '', responseData: '', status: '' };
            var input = { MessageType: Function_WriteKey, KeyIndex: keyIndex, KeyData: keyData };
			var event = new CustomEvent(event_ipk_request, { 'detail': input });
			window.dispatchEvent(event);
            DelayFunc(Function_WriteKey, false);
			var check = setInterval(function () {
                if (input.MessageType == g_DataGet.action) {
                    resolve(JSON.stringify(g_DataGet));
                    clearInterval(check);
                }
            }, 20);
        }
        catch (e) {
            reject(e);
        }
    });	
}
function ModifyPin(userType, oldPin, newPin) {
	return new Promise(function (resolve, reject) {
        try {
			g_DataGet =  { action: '', responseData: '', status: '' };
            var input = { MessageType: Function_ModifyPin, UserType: userType, OldPin: oldPin, NewPin: newPin};
			var event = new CustomEvent(event_ipk_request, { 'detail': input });
			window.dispatchEvent(event);
            DelayFunc(Function_ModifyPin, false);
			var check = setInterval(function () {
                if (input.MessageType == g_DataGet.action) {
                    resolve(JSON.stringify(g_DataGet));
                    clearInterval(check);
                }
            }, 20);
        }
        catch (e) {
            reject(e);
        }
    });	
}
function GetPinResetReq() {
	return new Promise(function (resolve, reject) {
        try {
			g_DataGet =  { action: '', responseData: '', status: '' };
            var input = { MessageType: Function_GetPinResetReq};
			var event = new CustomEvent(event_ipk_request, { 'detail': input });
			window.dispatchEvent(event);
            DelayFunc(Function_GetPinResetReq, false);
			var check = setInterval(function () {
                if (input.MessageType == g_DataGet.action) {
                    resolve(JSON.stringify(g_DataGet));
                    clearInterval(check);
                }
            }, 20);
        }
        catch (e) {
            reject(e);
        }
    });	
}
function ResetPin(innerSKey,newPin) {
	return new Promise(function (resolve, reject) {
        try {
			g_DataGet =  { action: '', responseData: '', status: '' };
            var input = { MessageType: Function_ResetPin, InnerSKey: innerSKey, NewPin: newPin};
			var event = new CustomEvent(event_ipk_request, { 'detail': input });
			window.dispatchEvent(event);
            DelayFunc(Function_ResetPin, false);
			var check = setInterval(function () {
                if (input.MessageType == g_DataGet.action) {
                    resolve(JSON.stringify(g_DataGet));
                    clearInterval(check);
                }
            }, 20);
        }
        catch (e) {
            reject(e);
        }
    });	
}
function getUUID() {
	return new Promise(function (resolve, reject) {
        try {
			resolve('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                return (c === 'x' ? (Math.random() * 16) | 0 : 'r&0x3' | '0x8').toString(16)
              }))
        }
        catch (e) {
            reject(e);
        }
    });	
}
// window.addEventListener(event_key_response,
//     function (message) {
//         console.log(message.detail);
//     }, false);