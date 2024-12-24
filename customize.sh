SKIPUNZIP=0
. "$MODPATH"/util_functions.sh
api_level_arch_detect
magisk_path=/data/adb/modules/
module_id=$(grep_prop id $MODPATH/module.prop)

# 基础函数
add_props() {
  local line="$1"
  echo "$line" >>"$MODPATH"/system.prop
}

add_post_fs_data() {
  local line="$1"
  printf "\n$line\n" >>"$MODPATH"/post-fs-data.sh
}

key_check() {
  while true; do
    key_check=$(/system/bin/getevent -qlc 1)
    key_event=$(echo "$key_check" | awk '{ print $3 }' | grep 'KEY_')
    key_status=$(echo "$key_check" | awk '{ print $4 }')
    if [[ "$key_event" == *"KEY_"* && "$key_status" == "DOWN" ]]; then
      keycheck="$key_event"
      break
    fi
  done
  while true; do
    key_check=$(/system/bin/getevent -qlc 1)
    key_event=$(echo "$key_check" | awk '{ print $3 }' | grep 'KEY_')
    key_status=$(echo "$key_check" | awk '{ print $4 }')
    if [[ "$key_event" == *"KEY_"* && "$key_status" == "UP" ]]; then
      break
    fi
  done
}

if [[ "$KSU" == "true" ]]; then
  ui_print "- KernelSU 用户空间当前的版本号: $KSU_VER_CODE"
  ui_print "- KernelSU 内核空间当前的版本号: $KSU_KERNEL_VER_CODE"
  if [ "$KSU_VER_CODE" -lt 11551 ]; then
    ui_print "*********************************************"
    ui_print "- 请更新 KernelSU 到 v0.8.0+ ！"
    abort "*********************************************"
  fi
elif [[ "$APATCH" == "true" ]]; then
  ui_print "- APatch 当前的版本号: $APATCH_VER_CODE"
  ui_print "- APatch 当前的版本名: $APATCH_VER"
  ui_print "- KernelPatch 用户空间当前的版本号: $KERNELPATCH_VERSION"
  ui_print "- KernelPatch 内核空间当前的版本号: $KERNEL_VERSION"
  if [ "$APATCH_VER_CODE" -lt 10568 ]; then
    ui_print "*********************************************"
    ui_print "- 请更新 APatch 到 10568+ ！"
    abort "*********************************************"
  fi
else
  ui_print "- Magisk 版本: $MAGISK_VER_CODE"
fi

# KSU Web UI
is_need_install_ksu_web_ui=1
HAS_BEEN_INSTALLED_KsuWebUI_APK=$(pm list packages | grep io.github.a13e300.ksuwebui)
if [[ "$KSU" == "true" || "$APATCH" == "true" ]]; then
  is_need_install_ksu_web_ui=0
fi
if [[ $HAS_BEEN_INSTALLED_KsuWebUI_APK == *"package:io.github.a13e300.ksuwebui"* ]]; then
  is_need_install_ksu_web_ui=0
fi
if [[ $is_need_install_ksu_web_ui == 1 ]]; then
  ui_print "*********************************************"
  ui_print "- 是否安装KsuWebUI？"
  ui_print "- [重要提醒]: 赋予Root权限可以可视化管理模块提供的功能"
  ui_print "  音量+ ：是"
  ui_print "  音量- ：否"
  ui_print "*********************************************"
  key_check
  if [[ "$keycheck" == "KEY_VOLUMEUP" ]]; then
    ui_print "- 正在为你安装KSU Web UI，请稍等~"
    unzip -jo "$ZIPFILE" 'common/apks/KsuWebUI.apk' -d /data/local/tmp/ &>/dev/null
    pm install -r /data/local/tmp/KsuWebUI.apk &>/dev/null
    rm -rf /data/local/tmp/KsuWebUI.apk
    HAS_BEEN_INSTALLED_KsuWebUI_APK=$(pm list packages | grep io.github.a13e300.ksuwebui)
    if [[ $HAS_BEEN_INSTALLED_KsuWebUI_APK == *"package:io.github.a13e300.ksuwebui"* ]]; then
      ui_print "- 好诶，KSUWebUI安装完成！"
    else
      abort "- KSUWebUI安装失败，请尝试重新安装！"
      abort "- 也可前往模块网盘下载单独的 KsuWebUI apk 进行手动安装！"
    fi
  else
    ui_print "*********************************************"
    ui_print "- 你选择不安装KsuWebUI"
    ui_print "*********************************************"
  fi
fi


ui_print "*********************************************"
ui_print "- 好诶w，模块已经安装完成了，重启设备后生效"
ui_print "- 功能具体支持情况以系统为准"
ui_print "*********************************************"
