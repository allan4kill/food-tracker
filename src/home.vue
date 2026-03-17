<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-center mb-8">Food Tracker - QR Codes</h1>

      <!-- QR Code Input Section -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Scan or Enter QR Code</h2>

        <!-- Scan Mode Toggle -->
        <div class="mb-4">
          <div class="flex gap-2">
            <button
              @click="scanMode = 'manual'"
              :class="[
                'px-4 py-2 rounded font-medium transition-colors',
                scanMode === 'manual'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              Manual Input
            </button>
            <button
              @click="scanMode = 'camera'"
              :class="[
                'px-4 py-2 rounded font-medium transition-colors',
                scanMode === 'camera'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              Camera Scan
            </button>
          </div>
        </div>

        <!-- Manual Input Mode -->
        <div v-if="scanMode === 'manual'" class="flex flex-col md:flex-row gap-4 items-end">
          <div class="flex-1">
            <label class="block text-sm font-medium mb-2">Enter QR Code ID:</label>
            <input
              v-model="inputQrId"
              @keyup.enter="processQrCode"
              placeholder="e.g., user001"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <button
            @click="processQrCode"
            :disabled="!inputQrId.trim() || isProcessing"
            class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {{ isProcessing ? 'Processing...' : 'Process QR Code' }}
          </button>
        </div>

        <!-- Camera Scan Mode -->
        <div v-if="scanMode === 'camera'" class="text-center">
          <button
            @click="startScanning"
            :disabled="isScanning"
            class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 mb-4"
          >
            {{ isScanning ? 'Scanning... (Point camera at QR code)' : 'Start Camera Scan' }}
          </button>

          <div class="mb-4">
            <div class="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100 p-4 max-w-md mx-auto">
              <p class="text-sm text-gray-600 mb-2">
                {{ isMobile ? 'Position QR code within the camera frame' : 'Position QR code in front of camera' }}
              </p>
              <p class="text-xs text-gray-500 mb-2">
                Camera will automatically detect QR codes, or use "Capture & Scan" for manual detection
              </p>
              <video
                ref="videoRef"
                class="w-full h-48 object-cover rounded border border-gray-400"
                :class="{ 'opacity-0': !isScanning }"
                autoplay
                playsinline
                muted
              ></video>
              <div v-if="!isScanning" class="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-50">
                <p class="text-sm">Camera will appear here when started</p>
              </div>
            </div>
            <!-- file input fallback -->
            <div class="mt-2 text-center">
              <label class="cursor-pointer inline-block px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-xs">
                📁 Upload image
                <input type="file" accept="image/*" @change="handleFileScan" class="hidden" />
              </label>
            </div>
          </div>

          <div v-if="cameraError || cameraStatus" class="text-center p-2 mb-4">
            <p v-if="cameraError" class="text-red-500">Camera Error: {{ cameraError }}</p>
            <p v-if="cameraStatus" class="text-gray-600">{{ cameraStatus }}</p>
            <button v-if="cameraError" @click="retryCamera" class="mt-1 text-blue-500 underline text-sm">Retry</button>
          </div>

          <div v-if="isScanning" class="text-center">
            <div class="flex items-center justify-center mb-2">
              <div class="animate-pulse w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span class="text-sm text-green-600">{{ cameraStatus }}</span>
            </div>
            <button
              @click="stopScanning"
              class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
            >
              Stop Scanning
            </button>
            <button
              @click="captureAndScan"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Capture & Scan
            </button>
          </div>
        </div>

        <p class="text-sm text-gray-600 mt-2">
          Use camera scanning or manually enter the user ID to process meals
        </p>
      </div>

      <!-- User Meal Section -->
      <div v-if="user" class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-semibold">{{ user.name }}</h2>
          <p class="text-gray-500">{{ user.qrId }}</p>
        </div>

        <div class="text-center">
          <h3 class="text-lg font-semibold mb-4">Today's Meals</h3>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              @click="giveMeal('breakfast')"
              :disabled="userBreakfast"
              :class="[
                'px-6 py-3 rounded-lg font-semibold transition-colors text-lg',
                userBreakfast
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              ]"
            >
              {{ userBreakfast ? '✓ Breakfast Given' : 'Give Breakfast' }}
            </button>
            <button
              @click="giveMeal('lunch')"
              :disabled="userLunch"
              :class="[
                'px-6 py-3 rounded-lg font-semibold transition-colors text-lg',
                userLunch
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              ]"
            >
              {{ userLunch ? '✓ Lunch Given' : 'Give Lunch' }}
            </button>
            <button
              @click="giveMeal('dinner')"
              :disabled="userDinner"
              :class="[
                'px-6 py-3 rounded-lg font-semibold transition-colors text-lg',
                userDinner
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              ]"
            >
              {{ userDinner ? '✓ Dinner Given' : 'Give Dinner' }}
            </button>
          </div>
        </div>

        <div class="text-center mt-6">
          <button
            @click="resetUser"
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Process Another User
          </button>
        </div>
      </div>

      <!-- QR Codes Display Section -->
      <div class="mb-6 flex flex-wrap gap-4 items-center justify-center">
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium">Search Users:</label>
          <input 
            v-model="searchQuery" 
            @input="currentPage = 1"
            placeholder="e.g., user002"
            class="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
          <button 
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
          >
            Clear
          </button>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-sm font-medium">Users per page:</label>
          <select v-model="usersPerPage" @change="currentPage = 1" class="px-3 py-1 border rounded">
            <option :value="50">50</option>
            <option :value="100">100</option>
            <option :value="200">200</option>
            <option :value="500">500</option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300">Previous</button>
          <span class="text-sm">Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300">Next</button>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-sm font-medium">Go to page:</label>
          <input v-model.number="gotoPage" @keyup.enter="goToPage" type="number" min="1" :max="totalPages" class="px-3 py-1 border rounded w-16">
          <button @click="goToPage" class="px-3 py-1 bg-green-500 text-white rounded">Go</button>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        <div v-for="user in paginatedUsers" :key="user.qrId" class="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
          <div class="mb-2">
            <img :src="user.qrCode" :alt="`QR Code for ${user.name}`" class="w-full h-auto max-w-24 mx-auto cursor-pointer" @click="processQrCode(user.qrId)" />
          </div>
          <p class="text-sm font-medium">{{ user.name }}</p>
          <p class="text-xs text-gray-500">{{ user.qrId }}</p>
          <button
            @click="processQrCode(user.qrId)"
            class="mt-2 text-xs text-blue-500 hover:text-blue-700 underline"
          >
            Select
          </button>
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
const usersPerPage = ref(100);
const currentPage = ref(1);
const gotoPage = ref(1);
const user = ref(null);
const userBreakfast = ref(false);
const userLunch = ref(false);
const userDinner = ref(false);
const inputQrId = ref('');
const searchQuery = ref('');
const isProcessing = ref(false);
const scanMode = ref('manual'); // 'manual' or 'camera'
const isScanning = ref(false);
const cameraError = ref(null);
const cameraStatus = ref(''); // holds human-readable status messages for camera operations
const videoRef = ref(null);
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
  const userCount = 1000;
  
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

    alert(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)} recorded successfully!`);

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

