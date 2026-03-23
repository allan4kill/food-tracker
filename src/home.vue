
<template>
  <div v-if="blankMode" class="min-h-screen bg-white"></div>
  <div v-else class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- Mobile-First Header --->
    <header class="bg-white/90 backdrop-blur-md shadow-sm border-b border-white/30 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <span class="text-white text-xl sm:text-2xl">🍽️</span>
            </div>
            <div>
              <h1 class="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Food Tracker
              </h1>
              <p class="text-gray-600 text-xs sm:text-sm hidden sm:block">QR Code Meal Management</p>
            </div>
          </div>
          <div class="hidden lg:flex items-center space-x-2 text-sm text-gray-600">
            <span class="flex items-center space-x-1">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Online</span>
            </span>
          </div>
        </div>
      </div>
    </header>

    <transition name="fade">
      <div v-if="toast.show" class="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 w-full max-w-md">
        <div :class="['w-full rounded-full px-5 py-3 text-white shadow-xl ring-1 ring-white/30 flex items-center justify-center gap-3 text-sm sm:text-base animate-bounce', toast.gradient]">
          <span class="text-2xl">{{ toast.icon }}</span>
          <span class="font-semibold">{{ toast.message }}</span>
        </div>
      </div>
    </transition>

    <div class="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      <!-- QR Code Input Section -->
      <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <h2 class="text-xl font-bold text-white flex items-center space-x-2">
            <span class="text-2xl">📱</span>
            <span>Scan or Enter QR Code</span>
          </h2>
        </div>

        <div class="p-4 sm:p-6">
          <!-- Scan Mode Toggle - Mobile Optimized -->
          <div class="mb-4 sm:mb-6">
            <div class="flex gap-1 sm:gap-3 p-1 bg-gray-100 rounded-xl w-full sm:w-fit mx-auto">
              <button
                @click="scanMode = 'manual'"
                :class="[
                  'flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base',
                  scanMode === 'manual'
                    ? 'bg-white text-blue-600 shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                ]"
              >
                <span class="text-base sm:text-lg">✏️</span>
                <span class="hidden xs:inline">Manual</span>
                <span class="xs:hidden">Type</span>
              </button>
              <button
                @click="scanMode = 'camera'"
                :class="[
                  'flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base',
                  scanMode === 'camera'
                    ? 'bg-white text-green-600 shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                ]"
              >
                <span class="text-base sm:text-lg">📷</span>
                <span class="hidden xs:inline">Camera</span>
                <span class="xs:hidden">Scan</span>
              </button>
            </div>
          </div>

          <!-- Manual Input Mode -->
          <div v-if="scanMode === 'manual'" class="space-y-4">
            <div class="space-y-3">
              <label class="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                <span>🔢</span>
                <span>QR Code ID</span>
              </label>
              <div class="flex flex-col sm:flex-row gap-3">
                <input
                  v-model="inputQrId"
                  @keyup.enter="processQrCode"
                  placeholder="user001"
                  class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-base sm:text-lg"
                >
                <button
                  @click="processQrCode"
                  :disabled="!inputQrId.trim() || isProcessing"
                  class="px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold flex items-center justify-center space-x-2 min-w-[120px] sm:min-w-[140px]"
                >
                  <span v-if="isProcessing" class="animate-spin">⏳</span>
                  <span v-else>🚀</span>
                  <span class="hidden sm:inline">{{ isProcessing ? 'Processing...' : 'Process' }}</span>
                  <span class="sm:hidden">{{ isProcessing ? '...' : 'Go' }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Camera Scan Mode -->
          <div v-if="scanMode === 'camera'" class="space-y-4 sm:space-y-6">
            <!-- Start Scan Button - Mobile Optimized -->
            <div class="text-center">
              <button
                @click="startScanning"
                :disabled="isScanning"
                class="w-full sm:w-auto px-6 sm:px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-base sm:text-lg flex items-center justify-center space-x-2 mx-auto"
              >
                <span v-if="isScanning" class="animate-pulse text-xl">📷</span>
                <span v-else class="text-xl">🎥</span>
                <span>{{ isScanning ? 'Scanning...' : 'Start Camera Scan' }}</span>
              </button>
            </div>

            <!-- Camera Viewport -->
            <div class="bg-gray-50 rounded-xl p-4 sm:p-6 border-2 border-dashed border-gray-300 relative overflow-hidden">
              <div class="text-center mb-3 sm:mb-4">
                <p class="text-sm text-gray-600 mb-1 flex items-center justify-center space-x-2">
                  <span>📍</span>
                  <span class="text-center">{{ isMobile ? 'Position QR code within frame' : 'Position QR code in front of camera' }}</span>
                </p>
                <p class="text-xs text-gray-500 hidden sm:block">Camera will automatically detect QR codes</p>
              </div>
              <div class="relative mb-4">
                <video
                  ref="videoRef"
                  class="w-full h-48 sm:h-64 object-cover rounded-lg border-2 border-gray-400 shadow-inner mx-auto"
                  :class="{ 'opacity-0': !isScanning }"
                  autoplay
                  playsinline
                  muted
                ></video>
                <div v-if="!isScanning" class="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-100 rounded-lg">
                  <div class="text-center p-4">
                    <span class="text-3xl sm:text-4xl mb-2 block">📷</span>
                    <p class="text-sm">Tap "Start Camera Scan" above</p>
                  </div>
                </div>
              </div>
              <!-- File upload fallback -->
              <div class="text-center">
                <label class="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-300 text-sm font-medium">
                  <span>📁</span>
                  <span>Upload Image</span>
                  <input type="file" accept="image/*" @change="handleFileScan" class="hidden" />
                </label>
              </div>
            </div>

            <div v-if="cameraError || cameraStatus" class="text-center p-4 bg-red-50 rounded-xl border border-red-200">
              <p v-if="cameraError" class="text-red-600 font-medium flex items-center justify-center space-x-2">
                <span>❌</span>
                <span>Camera Error: {{ cameraError }}</span>
              </p>
              <p v-if="cameraStatus && !cameraError" class="text-gray-600 flex items-center justify-center space-x-2">
                <span class="animate-pulse">🔄</span>
                <span>{{ cameraStatus }}</span>
              </p>
              <button v-if="cameraError" @click="retryCamera" class="mt-3 text-blue-500 underline text-sm hover:text-blue-700 transition-colors">
                🔄 Retry
              </button>
            </div>

            <div v-if="isScanning" class="text-center space-y-4">
              <div class="flex items-center justify-center space-x-2 mb-4">
                <div class="animate-pulse w-4 h-4 bg-green-500 rounded-full"></div>
                <span class="text-sm text-green-600 font-medium">{{ cameraStatus }}</span>
              </div>
              <div class="flex justify-center space-x-4">
                <button
                  @click="stopScanning"
                  class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium flex items-center space-x-2"
                >
                  <span>⏹️</span>
                  <span>Stop Scanning</span>
                </button>
                <button
                  @click="captureAndScan"
                  class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium flex items-center space-x-2"
                >
                  <span>📸</span>
                  <span>Capture & Scan</span>
                </button>
              </div>
            </div>
          </div>

          <p class="text-sm text-gray-600 mt-4 flex items-center space-x-2">
            <span>💡</span>
            <span>Use camera scanning or manually enter the user ID to process meals</span>
          </p>
        </div>
      </div>

      <!-- User Meal Section -->
      <div v-if="user" class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 overflow-hidden">
        <div class="bg-gradient-to-r from-green-500 to-teal-600 p-4 sm:p-6">
          <h2 class="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
            <span class="text-xl sm:text-2xl">👤</span>
            <span>Today's Meals</span>
          </h2>
        </div>

        <div class="p-4 sm:p-6">
          <div class="text-center mb-6 sm:mb-8">
            <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <span class="text-white text-xl sm:text-2xl font-bold">{{ user.name.charAt(0) }}</span>
            </div>
            <h3 class="text-lg sm:text-2xl font-bold text-gray-800">{{ user.name }}</h3>
            <p class="text-gray-500 font-medium text-sm sm:text-base">{{ user.qrId }}</p>
          </div>

          <div class="text-center">
            <div class="grid grid-cols-3 gap-3 sm:gap-6 max-w-lg sm:max-w-2xl mx-auto">
              <button
                @click="giveMeal('breakfast')"
                :disabled="userBreakfast"
                :class="[
                  'p-4 sm:p-6 rounded-xl font-bold text-sm sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex flex-col items-center space-y-2 sm:space-y-3 active:scale-95',
                  userBreakfast
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-2 border-gray-300'
                    : 'bg-gradient-to-r from-orange-700 to-orange-900 text-white hover:from-orange-800 hover:to-orange-950 border-2 border-orange-600',
                  recentlySavedMeal === 'breakfast' ? 'ring-4 ring-orange-200/80 animate-pulse' : ''
                ]"
              >
                <span class="text-2xl sm:text-3xl">{{ userBreakfast ? '✅' : '🌅' }}</span>
                <span class="text-xs sm:text-sm">{{ userBreakfast ? 'Done' : 'Breakfast' }}</span>
              </button>
              <button
                @click="giveMeal('lunch')"
                :disabled="userLunch"
                :class="[
                  'p-4 sm:p-6 rounded-xl font-bold text-sm sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex flex-col items-center space-y-2 sm:space-y-3 active:scale-95',
                  userLunch
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-2 border-gray-300'
                    : 'bg-gradient-to-r from-green-700 to-green-900 text-white hover:from-emerald-800 hover:to-emerald-900 border-2 border-green-800',
                  recentlySavedMeal === 'lunch' ? 'ring-4 ring-emerald-200/80 animate-pulse' : ''
                ]"
              >
                <span class="text-2xl sm:text-3xl">{{ userLunch ? '✅' : '☀️' }}</span>
                <span class="text-xs sm:text-sm">{{ userLunch ? 'Done' : 'Lunch' }}</span>
              </button>
              <button
                @click="giveMeal('dinner')"
                :disabled="userDinner"
                :class="[
                  'p-4 sm:p-6 rounded-xl font-bold text-sm sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex flex-col items-center space-y-2 sm:space-y-3 active:scale-95',
                  userDinner
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-2 border-gray-300'
                    : 'bg-gradient-to-r from-orange-700 to-green-900 text-white hover:from-orange-800 hover:to-green-950 border-2 border-purple-800',
                  recentlySavedMeal === 'dinner' ? 'ring-4 ring-purple-200/80 animate-pulse' : ''
                ]"
              >
                <span class="text-2xl sm:text-3xl">{{ userDinner ? '✅' : '🌙' }}</span>
                <span class="text-xs sm:text-sm">{{ userDinner ? 'Done' : 'Dinner' }}</span>
              </button>
            </div>
          </div>

          <div class="text-center mt-6 sm:mt-8">
            <button
              @click="resetUser"
              class="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-sm sm:text-base flex items-center justify-center space-x-2 mx-auto"
            >
              <span>🔄</span>
              <span>New User</span>
            </button>
          </div>
        </div>
      </div>

      <!-- QR Codes Display Section -->
      <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-4 sm:p-6">
        <div class="flex flex-col gap-4 mb-6">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <span class="text-xl sm:text-2xl">🔍</span>
            <span>QR Code Directory</span>
          </h2>

          <div class="flex flex-col gap-4">
            <!-- Search Bar -->
            <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
              <label class="text-sm font-semibold text-gray-700 flex items-center space-x-2 min-w-fit">
                <span>🔎</span>
                <span>Search:</span>
              </label>
              <div class="flex gap-2 flex-1">
                <input
                  v-model="searchQuery"
                  @input="currentPage = 1"
                  placeholder="user001"
                  class="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-sm sm:text-base"
                >
                <button
                  v-if="searchQuery"
                  @click="searchQuery = ''"
                  class="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  ❌ Clear
                </button>
              </div>
            </div>

            <!-- Per Page Selector -->
            <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
              <label class="text-sm font-semibold text-gray-700 flex items-center space-x-2 min-w-fit">
                <span>📊</span>
                <span>Per page:</span>
              </label>
              <select v-model="usersPerPage" @change="currentPage = 1" class="px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-sm sm:text-base">
                <option :value="12">12</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div class="flex flex-col gap-3 sm:gap-4 items-center justify-center mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-xl">
          <!-- Page Navigation -->
          <div class="flex items-center gap-2">
            <button @click="prevPage" :disabled="currentPage === 1" class="px-2 py-1.5 sm:px-3 sm:py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none flex items-center space-x-1 text-xs sm:text-sm">
              <span>⬅️</span>
              <span class="hidden sm:inline">Previous</span>
            </button>
            <span class="text-xs sm:text-sm font-medium text-gray-700 px-2 py-1.5 sm:px-3 sm:py-2 bg-white rounded-lg shadow-sm min-w-[100px] sm:min-w-[120px] text-center">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="px-2 py-1.5 sm:px-3 sm:py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none flex items-center space-x-1 text-xs sm:text-sm">
              <span class="hidden sm:inline">Next</span>
              <span>➡️</span>
            </button>
          </div>

          <!-- Go to Page -->
          <div class="flex items-center gap-2">
            <label class="text-xs sm:text-sm font-semibold text-gray-700">Go to page:</label>
            <input v-model.number="gotoPage" @keyup.enter="goToPage" type="number" min="1" :max="totalPages" class="px-2 py-1.5 sm:px-3 sm:py-2 border-2 border-gray-200 rounded-lg w-12 sm:w-16 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-xs sm:text-sm">
            <button @click="goToPage" class="px-2 py-1.5 sm:px-3 sm:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-xs sm:text-sm">
              Go
            </button>
          </div>
        </div>

        <!-- QR Code Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 sm:gap-3 lg:gap-4">
          <div v-for="user in paginatedUsers" :key="user.qrId" class="bg-white p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group active:scale-95">
            <div class="mb-1 sm:mb-2 flex justify-center">
              <img :src="user.qrCode" :alt="`QR Code for ${user.name}`" class="w-full h-auto max-w-12 sm:max-w-14 md:max-w-16 mx-auto cursor-pointer rounded border-2 border-gray-200 group-hover:border-blue-300 transition-all duration-300" @click="processQrCode(user.qrId)" />
            </div>
            <div class="text-center">
              <p class="text-xs font-semibold text-gray-800 mb-0.5 truncate px-0.5" :title="user.name">{{ user.name }}</p>
              <p class="text-xs text-gray-500 mb-1 sm:mb-2 truncate px-0.5" :title="user.qrId">{{ user.qrId }}</p>
              <button
                @click="processQrCode(user.qrId)"
                class="w-full px-1.5 py-1 sm:px-2 sm:py-1.5 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:scale-95 font-medium flex items-center justify-center space-x-1 touch-manipulation"
              >
                <span class="text-sm">👆</span>
                <span class="hidden sm:inline">Select</span>
                <span class="sm:hidden">Tap</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { db } from './firebase';
import { doc, getDoc, updateDoc, setDoc, getDocs, collection } from "firebase/firestore";
import QRCode from 'qrcode';

// we will attempt jsQR first and fall back to ZXing when jsQR misses.
// ZXing import is done lazily to keep bundle small, but the library
// provides better detection for rotated/smeared codes that jsQR sometimes
// fails to recognize.

const users = ref([]);
const usersPerPage = ref(20);
const currentPage = ref(1);
const gotoPage = ref(1);
const user = ref(null);
const userBreakfast = ref(false);
const userLunch = ref(false);
const userDinner = ref(false);
const inputQrId = ref('');
const blankMode = ref(true); // true shows blank white page placeholder
const searchQuery = ref('');
const isProcessing = ref(false);
const scanMode = ref('manual'); // 'manual' or 'camera'
const isScanning = ref(false);
const cameraError = ref(null);
const cameraStatus = ref(''); // holds human-readable status messages for camera operations
const videoRef = ref(null);

// Success toast + meal animation state
const toast = ref({ show: false, message: '', icon: '✅', gradient: 'from-emerald-400 to-lime-500' });
const recentlySavedMeal = ref(null);
const toastTimeout = ref(null);
const mealPulseTimeout = ref(null);

function showSuccessToast(message, icon, gradient = 'from-emerald-400 to-lime-500') {
  if (toastTimeout.value) clearTimeout(toastTimeout.value);
  toast.value = { show: true, message, icon, gradient };
  toastTimeout.value = setTimeout(() => {
    toast.value.show = false;
  }, 2200);
}

function highlightMeal(mealType) {
  if (mealPulseTimeout.value) clearTimeout(mealPulseTimeout.value);
  recentlySavedMeal.value = mealType;
  mealPulseTimeout.value = setTimeout(() => {
    recentlySavedMeal.value = null;
  }, 2000);
}

// jsQR will be loaded lazily
const scanTimeout = ref(null);
const isMobile = ref(false);
const isHttps = ref(false);

// shared reference for jsQR library (lazy-loaded)
let jsqrLib = null;
// shared reference for ZXing reader (lazy-loaded fallback)
let zxingReader = null;

// Detect if we're on mobile
const detectMobile = () => {
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                   window.innerWidth <= 768;
  isHttps.value = window.location.protocol === 'https:';
};

// Generate users with QR codes - optimized for performance
const generateUsers = async () => {
  const userList = [];
  // QR code generation is CPU intensive
  const userCount = 1500;
  
  for (let i = 1; i <= userCount; i++) {
    const qrId = `user${i.toString().padStart(3, '0')}`;
    const qrCodeDataURL = await QRCode.toDataURL(qrId, {
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    userList.push({
      name: `User ${i}`,
      qrId: qrId,
      qrCode: qrCodeDataURL
    });
  }
  users.value = userList;
};

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / usersPerPage.value));

const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) {
    return users.value;
  }
  const query = searchQuery.value.toLowerCase().trim();
  return users.value.filter(user => 
    user.qrId.toLowerCase().includes(query) || 
    user.name.toLowerCase().includes(query)
  );
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * usersPerPage.value;
  const end = start + usersPerPage.value;
  return filteredUsers.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const goToPage = () => {
  if (gotoPage.value >= 1 && gotoPage.value <= totalPages.value) {
    currentPage.value = gotoPage.value;
  }
};

async function processQrCode(qrId = null) {
  console.log('🔍 processQrCode called with:', qrId);
  
  // Get the input value safely with proper type checking
  let codeToProcess = qrId;
  if (!codeToProcess) {
    const inputVal = inputQrId.value;
    // Handle case where input might not be a string
    codeToProcess = (inputVal === null || inputVal === undefined) ? '' : String(inputVal).trim();
  }
  
  if (!codeToProcess) {
    console.warn('⚠️ No QR code ID provided');
    alert('Please enter a QR code ID');
    return;
  }

  // Keep original for validation check only, but don't strip valid characters like spaces
  const sanitizedId = codeToProcess.trim();
  
  console.log('Processing QR code ID:', sanitizedId);
  isProcessing.value = true;

  try {
    const docRef = doc(db, "users", sanitizedId);
    console.log('Attempting to fetch user from Firestore...');
    const docSnap = await getDoc(docRef);
    console.log('Firestore response received. Exists:', docSnap.exists());

    if (docSnap.exists()) {
      const userData = docSnap.data();
      console.log('✅ User found in database:', userData);
      user.value = { ...userData, qrId: sanitizedId };
      const today = new Date().toISOString().split('T')[0];
      userBreakfast.value = user.value.meals?.[today]?.breakfast || false;
      userLunch.value = user.value.meals?.[today]?.lunch || false;
      userDinner.value = user.value.meals?.[today]?.dinner || false;
      console.log('✅ User loaded:', user.value);

      // Only clear input if it was manual input
      if (!qrId) {
        inputQrId.value = '';
      }
    } else {
      console.log('User not found for QR:', sanitizedId, '- Creating new user');

      // Auto-create user if not found
      try {
        // Format name: user002 -> User 002
        const formattedName = sanitizedId
          .replace(/(\d+)/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .trim();
        
        console.log('Creating new user with name:', formattedName);
        await setDoc(docRef, {
          name: formattedName,
          qrId: sanitizedId,
          meals: {},
          createdAt: new Date().toISOString()
        });

        user.value = {
          name: formattedName,
          qrId: sanitizedId,
          meals: {}
        };
        userBreakfast.value = false;
        userLunch.value = false;
        userDinner.value = false;

        console.log('✅ New user created:', user.value);

        if (!qrId) {
          inputQrId.value = '';
        }
      } catch (createError) {
        console.error('❌ Error creating user:', createError);
        alert("User not found and could not be created. Error: " + createError.message);
        return;
      }
    }
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    console.error('Error details:', error.code, error.message);
    alert("Error fetching user data: " + error.message + "\n\nFirebase: Check browser console for details.");
  } finally {
    isProcessing.value = false;
    console.log('✅ Processing complete');
  }
}

async function giveMeal(mealType) {
  if (!user.value?.qrId) return;

  console.log('Giving meal:', mealType, 'to user:', user.value.qrId);
  try {
    const today = new Date().toISOString().split('T')[0];
    const docRef = doc(db, "users", user.value.qrId);

    await updateDoc(docRef, {
      [`meals.${today}.${mealType}`]: true
    });

    if (mealType === 'breakfast') userBreakfast.value = true;
    if (mealType === 'lunch') userLunch.value = true;
    if (mealType === 'dinner') userDinner.value = true;
    console.log('Meal given successfully');

    const mealLabels = {
      breakfast: { icon: '🥐', message: 'Breakfast saved!', gradient: 'from-orange-700 via-orange-800 to-orange-900' },
      lunch: { icon: '🥗', message: 'Lunch saved!', gradient: 'from-green-700 via-emerald-800 to-teal-900' },
      dinner: { icon: '🍽️', message: 'Dinner saved!', gradient: 'from-orange-700 via-amber-800 to-green-900' }
    };
    const toastConfig = mealLabels[mealType] || mealLabels.breakfast;
    showSuccessToast(toastConfig.message, toastConfig.icon, toastConfig.gradient);
    highlightMeal(mealType);

  } catch (error) {
    console.error('Error updating meal:', error);
    alert("Error updating meal status. Please try again.");
  }
}

function resetUser() {
  user.value = null;
  userBreakfast.value = false;
  userLunch.value = false;
  userDinner.value = false;
}

async function startScanning() {
  try {
    // if already scanning we shouldn't try again
    if (isScanning.value) return;

    // nothing to load here; jsQR will be imported in the scan loop

    isScanning.value = true;
    cameraError.value = null;
    cameraStatus.value = 'Initializing camera...';

    const videoElement = videoRef.value;
    if (!videoElement) {
      throw new Error('Video element not found');
    }

    console.log('🎥 Starting camera setup...');
    console.log('📱 Browser:', navigator.userAgent);
    console.log('🔒 Protocol:', window.location.protocol);
    console.log('📱 navigator.mediaDevices:', !!navigator.mediaDevices);
    console.log('📷 getUserMedia:', !!navigator.mediaDevices?.getUserMedia);
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const protocol = window.location.protocol;
      if (protocol === 'http:') {
        throw new Error('HTTPS Required: Mobile browsers require HTTPS for camera access. Use localhost or deploy with HTTPS.');
      }
      throw new Error('Camera API not available on this browser. Try a different browser like Chrome or Firefox.');
    }

    cameraStatus.value = 'Requesting camera permission...';
    console.log('📸 Requesting camera stream...');

    // Step 1: Manually get camera stream with optimized constraints for fast QR detection
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment', // Back camera on mobile
        width: { ideal: 640, max: 1280 }, // Lower resolution for faster processing
        height: { ideal: 480, max: 720 },
        frameRate: { ideal: 15, max: 30 } // Lower frame rate for faster processing
      },
      audio: false
    });

    console.log('✅ Camera stream obtained');
    cameraStatus.value = 'Attaching camera to video element...';

    // Step 2: Attach stream to video element
    videoElement.srcObject = stream;

    // Step 3: Wait for video metadata to be loaded
    console.log('⏳ Waiting for video to be ready...');
    await new Promise((resolve, reject) => {
      const onLoadedMetadata = () => {
        console.log('✅ Video metadata loaded');
        videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
        resolve();
      };

      videoElement.addEventListener('loadedmetadata', onLoadedMetadata);

      // Timeout if metadata doesn't load
      setTimeout(() => {
        videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
        console.warn('⚠️ video metadata timeout, proceeding anyway');
        // resolve despite missing metadata so we can still scan
        resolve();
      }, 5000);
    });

    // Step 4: Ensure video is playing
    console.log('▶️ Starting video playback...');
    try {
      await videoElement.play();
      console.log('✅ Video is playing');
    } catch (playError) {
      console.warn('⚠️ Video play() failed, continuing anyway:', playError);
    }

    // if dimensions are still zero, log warning
    const vw = videoElement.videoWidth || videoElement.offsetWidth;
    const vh = videoElement.videoHeight || videoElement.offsetHeight;
    if (!vw || !vh) {
      console.warn('⚠️ Video dimensions are zero:', vw, 'x', vh);
      cameraStatus.value = 'Warning: video size not available';
    }

    cameraStatus.value = 'Scanning for QR code...';
    console.log('🎯 Ready to scan QR codes');
    // no external reader required; jsQR will run directly on canvas frames

    let scanCompleted = false;
    const scanTimeoutId = setTimeout(() => {
      if (!scanCompleted) {
        console.log('⏱️ Scan timeout after 5 seconds');
        cameraError.value = 'No QR code detected in 5 seconds. Try "Capture & Scan" or check lighting.';
        stopScanning();
      }
    }, 5000);
    // keep reference for cleanup from other functions
    scanTimeout.value = scanTimeoutId;

    // Step 6: Start manual scanning loop using canvas captures
    console.log('🔍 Starting manual scan loop...');
    console.log('📹 Video element readyState:', videoElement.readyState);
    console.log('📹 Video dimensions:', videoElement.videoWidth, 'x', videoElement.videoHeight);

    // prepare offscreen canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let frameCount = 0;
    let lastRotationAttempt = 0;
    const FRAME_SKIP = 1; // Process every 2nd frame for speed
    const DOWNSCALE_FACTOR = 0.6; // Aggressive downscale for fast processing

    // Preload jsQR library once
    let jsqrLib = null;
    let zxingReader = null;
    try {
      jsqrLib = (await import('jsqr')).default;
      console.log('⚡ jsQR preloaded for fast scanning');
    } catch (err) {
      console.warn('⚠️ Failed to preload jsQR:', err.message);
    }

    async function scanFrame() {
      if (!isScanning.value || scanCompleted) return;

      frameCount++;
      
      // Skip frames for speed
      if (frameCount % (FRAME_SKIP + 1) !== 0) {
        requestAnimationFrame(scanFrame);
        return;
      }
      
      // update canvas size if necessary
      let w = videoElement.videoWidth || videoElement.offsetWidth || 640;
      let h = videoElement.videoHeight || videoElement.offsetHeight || 480;

      if (w === 0 || h === 0) {
        if (frameCount % 30 === 0) {
          console.log('⏳ waiting for non-zero video dimensions');
        }
        requestAnimationFrame(scanFrame);
        return;
      }

      // Downscale for faster processing
      const scaledW = Math.round(w * DOWNSCALE_FACTOR);
      const scaledH = Math.round(h * DOWNSCALE_FACTOR);

      if (canvas.width !== scaledW || canvas.height !== scaledH) {
        canvas.width = scaledW;
        canvas.height = scaledH;
      }

      // draw current frame (downscaled)
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // Use preloaded jsQR library
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let qr = jsqrLib(imageData.data, imageData.width, imageData.height);
        if (qr) {
          scanCompleted = true;
          clearTimeout(scanTimeoutId);
          scanTimeout.value = null;
          console.log('✅ QR code detected (jsQR):', qr.data);
          processQrCode(qr.data);
          stopScanning();
          return;
        }
      } catch (err) {
        console.warn('⚠️ jsQR error:', err.message);
      }

      // Try rotations every 5 frames to reduce compute
      if (frameCount - lastRotationAttempt >= 5) {
        lastRotationAttempt = frameCount;
        try {
          // try rotated variants - some codes are sideways
          for (let r = 1; r <= 3 && !scanCompleted; r++) {
            const rotatedCanvas = document.createElement('canvas');
            rotatedCanvas.width = canvas.height;
            rotatedCanvas.height = canvas.width;
            const rctx = rotatedCanvas.getContext('2d');
            rctx.translate(rotatedCanvas.width/2, rotatedCanvas.height/2);
            rctx.rotate((Math.PI/2) * r);
            rctx.drawImage(canvas, -canvas.width/2, -canvas.height/2);
            const rd = rctx.getImageData(0,0,rotatedCanvas.width, rotatedCanvas.height);
            const qr = jsqrLib(rd.data, rd.width, rd.height);
            if (qr) {
              scanCompleted = true;
              clearTimeout(scanTimeoutId);
              scanTimeout.value = null;
              console.log('✅ QR code detected (jsQR rotated):', qr.data);
              processQrCode(qr.data);
              stopScanning();
              return;
            }
          }
        } catch (err) {
          console.warn('⚠️ jsQR rotation error:', err.message);
        }

        // if jsQR failed, use ZXing as a fallback (less frequently)
        if (!scanCompleted && frameCount % 10 === 0) {
          try {
            if (!zxingReader) {
              const { BrowserCodeReader } = await import('@zxing/browser');
              zxingReader = new BrowserCodeReader();
              console.log('⚙️ ZXing fallback loaded');
            }
            const result = await zxingReader.decodeFromCanvas(canvas);
            if (result) {
              scanCompleted = true;
              clearTimeout(scanTimeoutId);
              scanTimeout.value = null;
              console.log('✅ QR code detected (ZXing fallback):', result.getText());
              processQrCode(result.getText());
              stopScanning();
              return;
            }
          } catch (zxErr) {
            // ignore errors; we'll just keep looping
          }
        }
      }

      if (frameCount % 60 === 0) {
        console.log('🔄 scanning... frame', frameCount);
      }
      requestAnimationFrame(scanFrame);
    }

    // start loop
    scanFrame();

    console.log('✅ Manual QR detection loop started (using jsQR)');

  } catch (error) {
    console.error('❌ Camera setup error:', error);
    let errorMessage = 'Failed to access camera';

    if (error.message?.includes('HTTPS Required')) {
      errorMessage = 'HTTPS Required: Use localhost (http://localhost:5173) or deploy with HTTPS for mobile camera access.';
    } else if (error.message?.includes('different browser')) {
      errorMessage = 'Camera not supported in this browser. Try Chrome, Firefox, or Safari on iOS 14.5+.';
    } else if (error.name === 'NotAllowedError') {
      errorMessage = 'Camera permission denied. Allow camera access when prompted.';
    } else if (error.name === 'NotFoundError') {
      errorMessage = 'No camera found on this device.';
    } else if (error.name === 'NotSupportedError') {
      errorMessage = 'Camera API not supported.';
    } else if (error.name === 'PermissionDeniedError') {
      errorMessage = 'Camera permission denied. Check device settings.';
    } else if (error.message?.includes('metadata')) {
      errorMessage = 'Camera stream started but video failed to load. Try again.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error('💬 Error message:', errorMessage);
    cameraError.value = errorMessage;
    cameraStatus.value = errorMessage;

    // make sure scanning state is reset so user can retry
    stopScanning();
  }
}

function stopScanning() {
  // Clear any pending timeouts
  if (scanTimeout.value) {
    clearTimeout(scanTimeout.value);
    scanTimeout.value = null;
  }
  cameraStatus.value = '';



  // Stop camera stream
  const videoElement = videoRef.value;
  if (videoElement && videoElement.srcObject) {
    const stream = videoElement.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    videoElement.srcObject = null;
  }

  isScanning.value = false;
}

function retryCamera() {
  console.log('Retrying camera');
  cameraError.value = null;
  cameraStatus.value = '';
  startScanning();
}

async function captureAndScan() {
  console.log('📸 Capturing frame for QR scan...');
  
  const videoElement = videoRef.value;
  if (!videoElement) {
    console.error('❌ No video element found');
    return;
  }

  // Use globally preloaded jsQR library
  if (!jsqrLib) {
    cameraError.value = 'QR scanner not ready. Please wait for camera to initialize.';
    return;
  }

  try {
    // Create canvas to capture current frame
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // fallback dimensions if video not yet ready
    const w = videoElement.videoWidth || videoElement.offsetWidth || 640;
    const h = videoElement.videoHeight || videoElement.offsetHeight || 480;
    
    // Aggressive downscale for fast processing
    const scaledW = Math.round(w * 0.6);
    const scaledH = Math.round(h * 0.6);
    canvas.width = scaledW;
    canvas.height = scaledH;
    
    console.log('📐 Capturing at', scaledW, 'x', scaledH);
    // Draw current video frame to canvas (downscaled)
    ctx.drawImage(videoElement, 0, 0, scaledW, scaledH);
    
    console.log('🖼️ Frame captured, scanning for QR code...');
    
    // jsQR scan first (without rotation to speed up)
    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let qr = jsqrLib(imageData.data, imageData.width, imageData.height);
      if (qr) {
        console.log('✅ QR code found with jsQR:', qr.data);
        cameraStatus.value = 'QR code found!';
        processQrCode(qr.data);
        stopScanning();
        return;
      }
    } catch (jsErr) {
      console.warn('⚠️ jsQR scan error:', jsErr.message);
    }
    
    // try only 1 rotated version for speed (90 degrees)
    try {
      const rotatedCanvas = document.createElement('canvas');
      rotatedCanvas.width = canvas.height;
      rotatedCanvas.height = canvas.width;
      const rctx = rotatedCanvas.getContext('2d');
      rctx.translate(rotatedCanvas.width/2, rotatedCanvas.height/2);
      rctx.rotate(Math.PI/2); // 90 degrees only
      rctx.drawImage(canvas, -canvas.width/2, -canvas.height/2);
      const rd = rctx.getImageData(0,0,rotatedCanvas.width, rotatedCanvas.height);
      const qr = jsqrLib(rd.data, rd.width, rd.height);
      if (qr) {
        console.log('✅ QR code found with jsQR (rotated):', qr.data);
        cameraStatus.value = 'QR code found!';
        processQrCode(qr.data);
        stopScanning();
        return;
      }
    } catch (jsErr) {
      console.warn('⚠️ jsQR rotation scan error:', jsErr.message);
    }
    
    // fallback to ZXing if available and jsQR failed
    if (!zxingReader) {
      try {
        const { BrowserCodeReader } = await import('@zxing/browser');
        zxingReader = new BrowserCodeReader();
      } catch (e) {
        console.warn('⚠️ ZXing library not available');
      }
    }
    
    if (zxingReader) {
      try {
        const result = await zxingReader.decodeFromCanvas(canvas);
        if (result) {
          console.log('✅ QR code found with ZXing fallback:', result.getText());
          cameraStatus.value = 'QR code found!';
          processQrCode(result.getText());
          stopScanning();
          return;
        }
      } catch (zxErr) {
        console.warn('⚠️ ZXing fallback during capture scan:', zxErr.message);
      }
    }
    // Neither decoder found anything
    console.log('❌ No QR code found in captured frame');
    cameraStatus.value = 'No QR code found';
    cameraError.value = 'No QR code found in captured image. Try again with better lighting/position.';
    setTimeout(() => {
      cameraError.value = null;
    }, 3000);
    
  } catch (error) {
    console.error('❌ Capture setup error:', error);
    cameraStatus.value = 'Scan failed';
    cameraError.value = 'Failed to setup capture scan: ' + (error.message || error);
  }
}


onMounted(() => {
  detectMobile();
  generateUsers();
});

// handle file upload scanning
async function handleFileScan(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  cameraStatus.value = 'Scanning uploaded image...';
  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    try {
      if (!jsqrLib) {
        jsqrLib = (await import('jsqr')).default;
      }
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qr = jsqrLib(imageData.data, imageData.width, imageData.height);
      if (qr) {
        processQrCode(qr.data);
      } else {
        alert('No QR code found in the uploaded image.');
      }
    } catch (err) {
      console.error('Error scanning uploaded image', err);
      alert('Error scanning uploaded image');
    }
  };
}

// NOTE: In earlier versions we attempted an external QR‑server fallback; it's been
// removed now that jsQR is the primary/only decoder.  Keep this function around
// if you want to re-enable an external service later.

/*
async function sendCanvasToQrServer(canvas) {
  // ...implementation previously here...
}
*/


onUnmounted(() => {
  stopScanning();
});
</script>

<style scoped>
</style>

