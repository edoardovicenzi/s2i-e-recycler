import type { Product } from '../dataAccessLayer/ProductRepository';
import type { User } from '../dataAccessLayer/UserRepository';

export function isProduct(obj: any): obj is Product {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.user?.id === 'number' &&
    typeof obj.category?.id === 'number' &&
    typeof obj.manufacturer?.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.price === 'number' &&
    typeof obj.gpu === 'string' &&
    typeof obj.cpu === 'string' &&
    typeof obj.keyboardLayout === 'string' &&
    typeof obj.display === 'string' &&
    typeof obj.ram === 'string' &&
    typeof obj.drives === 'string' &&
    typeof obj.memory === 'string' &&
    typeof obj.storage === 'string' &&
    typeof obj.ports === 'string' &&
    (typeof obj.webcam === 'string' || obj.webcam === undefined)
  );
}
export function isUser(obj: any): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.email === 'string' &&
    typeof obj.password === 'string'
  );
}
