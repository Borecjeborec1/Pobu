#include <napi.h>
#include <iostream>
#include <Windows.h>
int normalizePixels(int num, int screenSize) {
  return num * 65536 / screenSize;
}
Napi::Value Key_tap(const Napi::CallbackInfo &info) {
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
  return Napi::Boolean::New(env, true);
}
Napi::Value Mouse_move(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  if (info.Length() != 3) {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
    return env.Null();
  }
  if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsBoolean()) {
    Napi::TypeError::New(env, "Wrong argument").ThrowAsJavaScriptException();
    return env.Null();
  }

  int dx = info[0].As<Napi::Number>();
  int dy = info[1].As<Napi::Number>();
  bool isAbsolute = info[2].As<Napi::Boolean>();

  INPUT Inputs[1] = {0};
  Inputs[0].type = INPUT_MOUSE;

  if (isAbsolute) {
    Inputs[0].mi.dx = normalizePixels(dx, GetSystemMetrics(SM_CXSCREEN));
    Inputs[0].mi.dy = normalizePixels(dy, GetSystemMetrics(SM_CYSCREEN));
    Inputs[0].mi.dwFlags = MOUSEEVENTF_ABSOLUTE | MOUSEEVENTF_MOVE;
  } else {
    Inputs[0].mi.dx = dx;
    Inputs[0].mi.dy = dy;
    Inputs[0].mi.dwFlags = MOUSEEVENTF_MOVE;
  }

  SendInput(1, Inputs, sizeof(INPUT));
  return Napi::Boolean::New(env, true);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "keyTap"),
              Napi::Function::New(env, Key_tap));
  exports.Set(Napi::String::New(env, "mouseMove"),
              Napi::Function::New(env, Mouse_move));
  return exports;
}

NODE_API_MODULE(addon, Init)