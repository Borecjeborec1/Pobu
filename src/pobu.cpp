#include <napi.h>
#include <iostream>
#include <Windows.h>

Napi::Value KeyTap(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  if (info.Length() != 1) {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
    return env.Null();
  }
  if (!info[0].IsNumber()) {
    Napi::TypeError::New(env, "Wrong argument").ThrowAsJavaScriptException();
    return env.Null();
  }
  int arg0 = info[0].As<Napi::Number>();
  INPUT ip;
  ip.type = INPUT_KEYBOARD;
  ip.ki.wScan = 0;
  ip.ki.time = 0;
  ip.ki.dwExtraInfo = 0;
  ip.ki.wVk = arg0;
  ip.ki.dwFlags = 0;
  SendInput(1, &ip, sizeof(INPUT));
  Napi::Number num = Napi::Number::New(env, arg0);
  return num;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "keyTap"),
              Napi::Function::New(env, KeyTap));
  return exports;
}

NODE_API_MODULE(addon, Init)