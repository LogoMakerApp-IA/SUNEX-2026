import { db, storage } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, query, orderBy, serverTimestamp, onSnapshot, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export type StatusPedido = 'aguardando_pagamento' | 'pagamento_enviado' | 'confirmado' | 'agendado' | 'em_execucao' | 'finalizado';

export interface Pedido {
  id: string; // ex: SUNEX-001
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  placas: number;
  servico: 'Essencial' | 'Performance' | 'Elite';
  pagamento: 'pix' | 'local';
  status: StatusPedido;
  comprovanteUrl: string;
  imagemAdminUrl?: string;
  data: string;
  createdAt?: any;
}

export function escutarPedidos(callback: (pedidos: Pedido[]) => void) {
  const q = query(collection(db, 'pedidos'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => doc.data() as Pedido));
  });
}

export function escutarPedidoUnico(id: string, callback: (pedido: Pedido | null) => void) {
  const pedidoRef = doc(db, 'pedidos', id.toUpperCase());
  return onSnapshot(pedidoRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as Pedido);
    } else {
      callback(null);
    }
  });
}

export async function criarPedido(pedido: Omit<Pedido, 'createdAt'>) {
  try {
    const pedidoRef = doc(db, 'pedidos', pedido.id);
    await setDoc(pedidoRef, {
      ...pedido,
      createdAt: serverTimestamp()
    });
    return pedido.id;
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    throw error;
  }
}

export async function buscarPedido(id: string): Promise<Pedido | null> {
  try {
    const pedidoRef = doc(db, 'pedidos', id.toUpperCase());
    const pedidoSnap = await getDoc(pedidoRef);
    if (pedidoSnap.exists()) {
      return pedidoSnap.data() as Pedido;
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    throw error;
  }
}

export async function listarPedidos(): Promise<Pedido[]> {
  try {
    const q = query(collection(db, 'pedidos'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Pedido);
  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    throw error;
  }
}

export async function atualizarStatus(id: string, status: StatusPedido) {
  try {
    const pedidoRef = doc(db, 'pedidos', id);
    const pedidoSnap = await getDoc(pedidoRef);
    
    await updateDoc(pedidoRef, { status });

    if (pedidoSnap.exists()) {
      const pedido = pedidoSnap.data() as Pedido;
      if (pedido.email) {
        // Simula o envio de email adicionando à coleção 'mail' 
        // (padrão para a extensão Firebase Trigger Email)
        const mailRef = collection(db, 'mail');
        await setDoc(doc(mailRef), {
          to: pedido.email,
          message: {
            subject: `Atualização do seu pedido ${pedido.id} - SUNEX`,
            html: `Olá ${pedido.nome},<br><br>O status do seu pedido para limpeza de placas solares foi atualizado para: <strong>${status.replace('_', ' ')}</strong>.<br><br>Acompanhe em nosso site.`
          },
          createdAt: serverTimestamp()
        });
      }
    }
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    throw error;
  }
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const max = 800; // max resolution
        if (width > height) {
          if (width > max) { height *= max / width; width = max; }
        } else {
          if (height > max) { width *= max / height; height = max; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.onerror = () => reject(new Error('Failed to load image.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

export async function enviarComprovante(pedidoId: string, file: File): Promise<string> {
  try {
    const base64Image = await fileToBase64(file);
    
    // Atualiza o pedido com o comprovante e status
    const pedidoRef = doc(db, 'pedidos', pedidoId);
    await updateDoc(pedidoRef, {
      comprovanteUrl: base64Image,
      status: 'pagamento_enviado'
    });

    return base64Image;
  } catch (error) {
    console.error("Erro ao enviar comprovante:", error);
    throw error;
  }
}

export async function anexarImagemAdmin(pedidoId: string, file: File): Promise<void> {
  try {
    const base64Image = await fileToBase64(file);
    const pedidoRef = doc(db, 'pedidos', pedidoId);
    await updateDoc(pedidoRef, {
      imagemAdminUrl: base64Image
    });
  } catch (error) {
    console.error("Erro ao anexar imagem admin:", error);
    throw error;
  }
}

export async function deletarPedido(id: string) {
  try {
    await deleteDoc(doc(db, 'pedidos', id));
  } catch (error) {
    console.error("Erro ao deletar pedido:", error);
    throw error;
  }
}

export async function zerarPedidos() {
  try {
    const q = query(collection(db, 'pedidos'));
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map(docSnap => deleteDoc(doc(db, 'pedidos', docSnap.id)));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Erro ao zerar pedidos:", error);
    throw error;
  }
}
