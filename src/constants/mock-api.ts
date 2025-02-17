////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Nextjs, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { Reimbursement } from '@/features/reimbursements/types';
import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter'; // For filtering

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Define the shape of Product data
export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

// Mock product data store
export const fakeProducts = {
  records: [] as Product[], // Holds the list of product objects

  // Initialize with sample data
  initialize() {
    const sampleProducts: Product[] = [];
    function generateRandomProductData(id: number): Product {
      const categories = [
        'Electronics',
        'Furniture',
        'Clothing',
        'Toys',
        'Groceries',
        'Books',
        'Jewelry',
        'Beauty Products'
      ];

      return {
        id,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
        photo_url: `https://api.slingacademy.com/public/sample-products/${id}.png`,
        category: faker.helpers.arrayElement(categories),
        updated_at: faker.date.recent().toISOString()
      };
    }

    // Generate remaining records
    for (let i = 1; i <= 20; i++) {
      sampleProducts.push(generateRandomProductData(i));
    }

    this.records = sampleProducts;
  },

  // Get all products with optional category filtering and search
  async getAll({
    categories = [],
    search
  }: {
    categories?: string[];
    search?: string;
  }) {
    let products = [...this.records];

    // Filter products based on selected categories
    if (categories.length > 0) {
      products = products.filter((product) =>
        categories.includes(product.category)
      );
    }

    // Search functionality across multiple fields
    if (search) {
      products = matchSorter(products, search, {
        keys: ['name', 'description', 'category']
      });
    }

    return products;
  },

  // Get paginated results with optional category filtering and search
  async getProducts({
    page = 1,
    limit = 10,
    categories,
    search
  }: {
    page?: number;
    limit?: number;
    categories?: string;
    search?: string;
  }) {
    await delay(1000);
    const categoriesArray = categories ? categories.split('.') : [];
    const allProducts = await this.getAll({
      categories: categoriesArray,
      search
    });
    const totalProducts = allProducts.length;

    // Pagination logic
    const offset = (page - 1) * limit;
    const paginatedProducts = allProducts.slice(offset, offset + limit);

    // Mock current time
    const currentTime = new Date().toISOString();

    // Return paginated response
    return {
      success: true,
      time: currentTime,
      message: 'Sample data for testing and learning purposes',
      total_products: totalProducts,
      offset,
      limit,
      products: paginatedProducts
    };
  },

  // Get a specific product by its ID
  async getProductById(id: number) {
    await delay(1000); // Simulate a delay

    // Find the product by its ID
    const product = this.records.find((product) => product.id === id);

    if (!product) {
      return {
        success: false,
        message: `Product with ID ${id} not found`
      };
    }

    // Mock current time
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Product with ID ${id} found`,
      product
    };
  }
};

// Initialize sample products
fakeProducts.initialize();

//Users
export function createRandomUser() {
  return {
    id: faker.string.uuid(),
    organization_id: faker.string.uuid(),
    email: faker.internet.email(),
    username: faker.internet.username(),
    name: faker.person.fullName(),
    role: faker.person.jobTitle(),
    attachments: faker.image.avatar(),
    registeredAt: faker.date.past()
  };
}

export const users = faker.helpers.multiple(createRandomUser, {
  count: 5
});

const reimbursementStatus = [
  'DRAFT',
  'SUBMITTED',
  'APPROVED',
  'REJECTED',
  'REIMBURSED'
];

const reimName = [
  'Travel',
  'Transportation',
  'Food',
  'Training',
  'Certification'
];

export const reimbursementType = [
  {
    id: faker.string.uuid(),
    organization_id: faker.string.uuid(),
    code: `${'REIM'}-${faker.number.int()}`,
    name: 'Travel',
    description: faker.finance.transactionDescription()
  },
  {
    id: faker.string.uuid(),
    organization_id: faker.string.uuid(),
    code: `${'REIM'}-${faker.number.int()}`,
    name: 'Transportation',
    description: faker.finance.transactionDescription()
  },
  {
    id: faker.string.uuid(),
    organization_id: faker.string.uuid(),
    code: `${'REIM'}-${faker.number.int()}`,
    name: 'Food',
    description: faker.finance.transactionDescription()
  },
  {
    id: faker.string.uuid(),
    organization_id: faker.string.uuid(),
    code: `${'REIM'}-${faker.number.int()}`,
    name: 'Training',
    description: faker.finance.transactionDescription()
  },
  {
    id: faker.string.uuid(),
    organization_id: faker.string.uuid(),
    code: `${'REIM'}-${faker.number.int()}`,
    name: 'Certification',
    description: faker.finance.transactionDescription()
  }
];

// reimbursement
export function createRandomReimbursement(tempId?: number) {
  return {
    tempId,
    id: faker.string.uuid(),
    reimbursementType: {
      reimbursement_type_id: faker.string.uuid(),
      name: faker.helpers.arrayElement(reimName),
      code: `${'REIM'}-${faker.number.int()}`
    },
    organization: {
      organization_id: faker.string.uuid(),
      name: faker.company.name()
    },
    date: faker.date.anytime(),
    amount: faker.finance.amount(),
    status: faker.helpers.arrayElement(reimbursementStatus),
    created_at: faker.date.anytime().toISOString(),
    updated_at: faker.date.anytime().toISOString(),
    created_by: faker.string.uuid(),
    updated_by: faker.string.uuid(),
    attachments: faker.image.avatar()
  };
}

export const fakeReimbursements = {
  sampleReimbursements: [] as Reimbursement[],
  generate() {
    const generatedReimbursementList: Reimbursement[] = [];

    for (let i = 1; i <= 50; i++) {
      generatedReimbursementList.push(createRandomReimbursement(i));
    }

    this.sampleReimbursements = generatedReimbursementList;
  },
  async getReimbursementList() {
    return [...this.sampleReimbursements];
  },

  async getReimbursementListById(reimbursementId: number) {
    await delay(1500);

    const reimbursement = this.sampleReimbursements.find((reimbursement) => {
      return reimbursement.tempId === reimbursementId;
    });

    if (!reimbursement) {
      return {
        messageType: 'error',
        message: 'No record found'
      };
    }

    return reimbursement;
  }
};

fakeReimbursements.generate();

// leaves
const leaveType = [
  'Sick Leave',
  'Vacation Leave',
  'Bereavement Leave',
  'Sabbatical Leave',
  'Maternity leave'
];

const leaveStatus = ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELED'];

export function createRandomLeaves() {
  return {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement(reimbursementType),
    leave_type: {
      leave_type_id: faker.string.uuid(),
      code: faker.string.alpha(4),
      name: faker.helpers.arrayElement(leaveType)
    },
    organization: {
      organization_id: faker.string.uuid(),
      name: faker.company.name()
    },
    start_date: faker.date
      .between({ from: '2022-01-01', to: '2023-12-31' })
      .toISOString(),
    end_date: faker.date
      .between({ from: '2022-01-01', to: '2023-12-31' })
      .toISOString(),
    days_applied: faker.number.int(12),
    status: faker.helpers.arrayElement(leaveStatus)
  };
}

export const leaves = faker.helpers.multiple(createRandomLeaves, {
  count: 50
});
