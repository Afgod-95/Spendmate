import { LucideIcon, Utensils, TrendingUp, ShoppingBag, Home, Car, Heart, Gift } from 'lucide-react-native';
import { AllCategoriesCardProps } from '@/components/CategoriesCard';

export const allCategoriesData: AllCategoriesCardProps[] = [
  {
    category: 'Food & Dining',
    icon: Utensils,
    iconColor: 'orange',
    type: 'Expense',
    total: '320.50',
  },
  {
    category: 'Investments',
    icon: TrendingUp,
    iconColor: '#0C986A',
    type: 'Income',
    total: '1,500.00',
  },
  {
    category: 'Shopping',
    icon: ShoppingBag,
    iconColor: '#800080',
    type: 'Expense',
    total: '210.00',
  },
  {
    category: 'Housing',
    icon: Home,
    iconColor: '#2563EB',
    type: 'Expense',
    total: '900.00',
  },
  {
    category: 'Transportation',
    icon: Car,
    iconColor: '#F59E0B',
    type: 'Expense',
    total: '120.00',
  },
  {
    category: 'Health & Fitness',
    icon: Heart,
    iconColor: '#EF4444',
    type: 'Expense',
    total: '75.00',
  },
  {
    category: 'Gifts',
    icon: Gift,
    iconColor: '#10B981',
    type: 'Expense',
    total: '50.00',
  },
];
