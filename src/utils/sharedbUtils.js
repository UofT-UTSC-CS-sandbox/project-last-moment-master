import sharedb from "sharedb/lib/client";

const socket = new WebSocket("ws://localhost:8080");
const connection = new sharedb.Connection(socket);

export function subscribeDoc(doc, setValue) {
  doc.subscribe((error) => {
    if (error) {
      console.error("Failed to subscribe to document:", error);
      return;
    }
    setValue(doc.data);
    doc.on("op", () => {
      setValue(doc.data);
    });
  });
}

export function applyOp(doc, op) {
  doc.submitOp(op, (error) => {
    if (error) {
      console.error("Failed to apply op:", error);
    }
  });
}

export function createDoc(collection, id, data) {
  const doc = connection.get(collection, id);
  doc.fetch((error) => {
    if (error) {
      console.error("Failed to fetch document:", error);
      return;
    }
    if (doc.type === null) {
      doc.create(data, (error) => {
        if (error) {
          console.error("Failed to create document:", error);
        }
      });
    }
  });
}

export function deleteDoc(collection, id) {
  const doc = connection.get(collection, id);
  doc.del((error) => {
    if (error) {
      console.error("Failed to delete document:", error);
    }
  });
}
