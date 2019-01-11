
# Set up paths
LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)

# Debug mode
NDK_DEBUG=1

# Specify C++ flags
LOCAL_CPPFLAGS := -std=c++14
LOCAL_CPPFLAGS += -fexceptions
LOCAL_CPPFLAGS += -frtti
LOCAL_CPPFLAGS += -Wall
LOCAL_CPPFLAGS += -Wextra
LOCAL_CPPFLAGS += -I$(LOCAL_PATH)/jni
LOCAL_CPPFLAGS += -I$(LOCAL_PATH)/cpp
LOCAL_CPPFLAGS += -I$(LOCAL_PATH)/../../../../node_modules/djinni-react-native/support-lib/jni
LOCAL_CPPFLAGS += -I$(LOCAL_PATH)/../../../../node_modules/djinni-react-native/support-lib/cpp
LOCAL_CPPFLAGS += -I$(LOCAL_PATH)/../../../../node_modules/djinni-react-native/support-lib
LOCAL_CPPFLAGS += -I$(LOCAL_PATH)/../cpp # vasern_manager_impl.cpp

# Specify sourc files
LOCAL_SRC_FILES += $(LOCAL_PATH)/jni/NativeVasernManager.cpp
LOCAL_SRC_FILES += $(wildcard $(LOCAL_PATH)/../cpp/*.cpp)
LOCAL_SRC_FILES += $(wildcard $(LOCAL_PATH)/../../../../node_modules/djinni-react-native/support-lib/jni/*.cpp)
LOCAL_SRC_FILES += $(wildcard $(LOCAL_PATH)/../../../../node_modules/djinni-react-native/support-lib/cpp/*.cpp)
LOCAL_SRC_FILES += $(wildcard $(LOCAL_PATH)/../../../../node_modules/djinni-react-native/support-lib/*.cpp)

# Specify module name for System.loadLibrary() call
LOCAL_MODULE := vasern

# Telling make to build the library
include $(BUILD_SHARED_LIBRARY)