"use server";

export type DataType = "products" | "users" | "employees" | "orders";

// Simulate database delay
const simulateDbDelay = () => new Promise((resolve) => setTimeout(resolve, 500));

// Mock database
const mockDatabase = {
  products: [
    { id: 1, name: "Laptop Pro 15", category: "Electronics", price: 1299.99, stock: 45, inStock: true, rating: 4.5 },
    { id: 2, name: "Wireless Moxuse", category: "Accessories", price: 29.99, stock: 8, inStock: true, rating: 4.2 },
    { id: 3, name: "USB-C Hub", category: "Accessories", price: 49.99, stock: 0, inStock: false, rating: 4.7 },
    { id: 4, name: "4K Monitor", category: "Electronics", price: 399.99, stock: 23, inStock: true, rating: 4.8 },
    { id: 5, name: "Mechanical Keyboard", category: "Accessories", price: 149.99, stock: 15, inStock: true, rating: 4.6 },
  ],
  users: [
    { id: 1, firstName: "John", lastName: "Doe", email: "john.doe@example.com", role: "Admin", department: "IT", active: true, joinDate: "2023-01-15" },
    { id: 2, firstName: "Jane", lastName: "Smith", email: "jane.smith@example.com", role: "Manager", department: "Sales", active: true, joinDate: "2023-03-20" },
    { id: 3, firstName: "Bob", lastName: "Johnson", email: "bob.johnson@example.com", role: "Developer", department: "Engineering", active: true, joinDate: "2022-11-05" },
    { id: 4, firstName: "Alice", lastName: "Williams", email: "alice.williams@example.com", role: "Designer", department: "Marketing", active: false, joinDate: "2023-06-10" },
  ],
  employees: [
    { id: 1, name: "Sarah Connor", position: "CEO", salary: 250000, experience: 15, status: "active" },
    { id: 2, name: "Kyle Reese", position: "CTO", salary: 200000, experience: 12, status: "active" },
    { id: 3, name: "John Connor", position: "Lead Developer", salary: 150000, experience: 8, status: "active" },
    { id: 4, name: "Ellen Ripley", position: "Security Lead", salary: 140000, experience: 10, status: "vacation" },
  ],
  orders: [
    { id: 1001, customer: "Acme Corp", product: "Enterprise License", amount: 5999.99, status: "completed", date: "2024-01-15" },
    { id: 1002, customer: "TechStart Inc", product: "Starter Package", amount: 999.99, status: "pending", date: "2024-01-18" },
    { id: 1003, customer: "Global Systems", product: "Premium Support", amount: 2499.99, status: "processing", date: "2024-01-20" },
    { id: 1004, customer: "Innovation Labs", product: "Custom Solution", amount: 12999.99, status: "completed", date: "2024-01-22" },
  ],
};

/**
 * Server action to load list data
 * Simulates a database query with 2-second delay
 */
export async function loadListData(dataType: DataType) {
  console.log(`[Server Action] Loading list data for: ${dataType}`);

  // Simulate database query delay
  await simulateDbDelay();

  const data = mockDatabase[dataType] || [];

  console.log(`[Server Action] Returning ${data.length} items`);
  return {
    success: true,
    data,
    dataType,
  };
}

/**
 * Server action to load single item data
 * Simulates a database query with 2-second delay
 */
export async function loadItemData(dataType: DataType, itemId: number | string) {
  console.log(`[Server Action] Loading item data for: ${dataType} #${itemId}`);

  // Simulate database query delay
  await simulateDbDelay();

  const data = mockDatabase[dataType] || [];
  const item = data.find((item: any) => item.id === Number(itemId));

  if (!item) {
    return {
      success: false,
      error: "Item not found",
      dataType,
    };
  }

  console.log(`[Server Action] Returning item:`, item);
  return {
    success: true,
    data: item,
    dataType,
  };
}
