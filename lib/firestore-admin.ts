import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore"
import { db } from "./firebase"

export interface User {
  id: string
  email: string
  fullname?: string
  username?: string
  balance?: number
  country?: string
  currency?: string
  registrationDate: any
  isActive?: boolean
  isSuspended?: boolean
  role?: string
  [key: string]: any
}

export interface PaginationOptions {
  pageSize?: number
  lastDoc?: QueryDocumentSnapshot<DocumentData>
}

// Get all users with pagination
export async function getUsers(options: PaginationOptions = {}) {
  const { pageSize = 20, lastDoc } = options

  let q = query(collection(db, "users"), orderBy("registrationDate", "desc"), limit(pageSize))

  if (lastDoc) {
    q = query(collection(db, "users"), orderBy("registrationDate", "desc"), startAfter(lastDoc), limit(pageSize))
  }

  const snapshot = await getDocs(q)
  const users: User[] = []

  snapshot.forEach((doc) => {
    users.push({
      id: doc.id,
      ...doc.data(),
    } as User)
  })

  return {
    users,
    lastDoc: snapshot.docs[snapshot.docs.length - 1],
    hasMore: snapshot.docs.length === pageSize,
  }
}

// Update user data
export async function updateUser(userId: string, data: Partial<User>) {
  const userRef = doc(db, "users", userId)
  await updateDoc(userRef, {
    ...data,
    updatedAt: new Date(),
  })
}

// Suspend/unsuspend user
export async function toggleUserSuspension(userId: string, suspend: boolean) {
  await updateUser(userId, {
    isSuspended: suspend,
    suspendedAt: suspend ? new Date() : null,
  })
}

// Delete user document
export async function deleteUser(userId: string) {
  const userRef = doc(db, "users", userId)
  await deleteDoc(userRef)
}

// Activate/deactivate user
export async function toggleUserStatus(userId: string, isActive: boolean) {
  await updateUser(userId, { isActive })
}
