// import { Injectable, inject, OnDestroy } from '@angular/core';
// import {
//   Firestore,
//   getDocs,
//   addDoc,
//   deleteDoc,
//   collection,
//   doc,
//   orderBy,
//   query,
//   onSnapshot,
//   DocumentReference,
// } from '@angular/fire/firestore';
// import { ToastService } from './toast.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class ImageService implements OnDestroy {
//   private firestore: Firestore = inject(Firestore);
//   toastService = inject(ToastService);
//   unsubscribeImages: () => void;

//   constructor() {
//     this.unsubscribeImages = this.subscribeToImages();
//   }

//   /**
//    * Unmounts firestore listener when service is destroyed
//    */
//   ngOnDestroy(): void {
//     if (this.unsubscribeImages) {
//       this.unsubscribeImages();
//     }
//   }

//   /**
//    * Returns a reference to the Firestore "images" collection
//    */
//   getImagesRef() {
//     return collection(this.firestore, 'images');
//   }

//   /**
//    * Returns a reference to a single image doc
//    */
//   getImageDocRef(docId: string) {
//     return doc(this.getImagesRef(), docId);
//   }

//   /**
//    * Listens to Firestore image collection
//    */
//   subscribeToImages() {
//     const q = query(this.getImagesRef(), orderBy('createdAt')); // or 'filename'

//     return onSnapshot(
//       q,
//       (snapshot) => {
//         this.images = [];
//         snapshot.forEach((docSnap) => {
//           const data = docSnap.data();
//           this.images.push({
//             id: docSnap.id,
//             filename: data['filename'],
//             fileType: data['fileType'],
//             base64: data['base64'],
//             createdAt: data['createdAt']?.toDate?.() || new Date(),
//             taskId: data['taskId'] || null,
//           });
//         });
//       },
//       (error) => {
//         this.toastService.triggerToast('Error loading image', 'error');
//         console.error('Firestore error while loading images:', error);
//       }
//     );
//   }

//   /**
//    * Lädt alle Bilder einmalig (wenn kein Live-Update nötig ist)
//    */
//   async loadImagesOnce(): Promise<GalleryImage[]> {
//     const result: GalleryImage[] = [];
//     const snapshot = await getDocs(this.getImagesRef());
//     snapshot.forEach((docSnap) => {
//       const data = docSnap.data();
//       result.push({
//         id: docSnap.id,
//         filename: data['filename'],
//         fileType: data['fileType'],
//         base64: data['base64'],
//         createdAt: data['createdAt']?.toDate?.() || new Date(),
//         taskId: data['taskId'] || null,
//       });
//     });
//     return result;
//   }

//   /**
//    * Adding a new image document to Firebase Firestore
//    */
//   async addImage(image: GalleryImage): Promise<DocumentReference | void> {
//     try {
//       return await addDoc(this.getImagesRef(), image);
//     } catch (error) {
//       this.toastService.triggerToast('Error adding image', 'error');
//       console.error('Firestore error while adding images:', error);
//     }
//   }

//   /**
//    * Deletes an image document
//    */
//   async deleteImage(id: string): Promise<void> {
//     try {
//       await deleteDoc(this.getImageDocRef(id));
//     } catch (error) {
//       this.toastService.triggerToast('Error deleting image', 'error');
//       console.error('Firestore error while deleting images:', error);
//     }
//   }
// }
