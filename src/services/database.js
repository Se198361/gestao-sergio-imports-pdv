// Database service for IndexedDB
class DatabaseService {
  constructor() {
    this.dbName = 'SergioImportsDB';
    this.version = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = (event) => reject(event.target.error);
      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains('products')) {
          const productsStore = db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
          productsStore.createIndex('name', 'name');
          productsStore.createIndex('category', 'category');
          productsStore.createIndex('barcode', 'barcode');
        }

        if (!db.objectStoreNames.contains('clients')) {
          const clientsStore = db.createObjectStore('clients', { keyPath: 'id', autoIncrement: true });
          clientsStore.createIndex('name', 'name');
          clientsStore.createIndex('email', 'email');
          clientsStore.createIndex('phone', 'phone');
        }

        if (!db.objectStoreNames.contains('sales')) {
          const salesStore = db.createObjectStore('sales', { keyPath: 'id', autoIncrement: true });
          salesStore.createIndex('date', 'date');
          salesStore.createIndex('clientId', 'clientId');
          salesStore.createIndex('total', 'total');
        }

        if (!db.objectStoreNames.contains('exchanges')) {
          const exchangesStore = db.createObjectStore('exchanges', { keyPath: 'id', autoIncrement: true });
          exchangesStore.createIndex('date', 'date');
          exchangesStore.createIndex('saleId', 'saleId');
          exchangesStore.createIndex('status', 'status');
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  _promisifyRequest(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  }

  async add(storeName, data) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    return this._promisifyRequest(store.add(data));
  }

  async put(storeName, data) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    return this._promisifyRequest(store.put(data));
  }

  async get(storeName, id) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    return this._promisifyRequest(store.get(id));
  }

  async getAll(storeName) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    return this._promisifyRequest(store.getAll());
  }

  async delete(storeName, id) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    return this._promisifyRequest(store.delete(id));
  }

  async search(storeName, indexName, query) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    return this._promisifyRequest(index.getAll(query));
  }
}

export const dbService = new DatabaseService();
