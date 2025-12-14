import { Briefcase, ShoppingCart, CreditCard, DollarSign, Gift } from 'lucide-react-native';
import { TransactionsCardProps } from '@/components/TransactionsCard';

export const transactionsData: TransactionsCardProps[] = [
  {
    icon: Briefcase,
    iconColor: '#0C986A',
    title: 'Monthly Salary - November',
    category: 'Salary & Jobs',
    type: 'Income',
    date: '2023-11-30',
    amount: '$3,000',
  },
  {
    icon: ShoppingCart,
    iconColor: '#991B1B',
    title: 'Groceries at Shoprite',
    category: 'Food & Dining',
    type: 'Expense',
    date: '2023-12-01',
    amount: '$150',
  },
  {
    icon: CreditCard,
    iconColor: '#1E40AF',
    title: 'Credit Card Payment',
    category: 'Finance',
    type: 'Expense',
    date: '2023-12-02',
    amount: '$500',
  },
  {
    icon: DollarSign,
    iconColor: '#0C986A',
    title: 'Freelance Project Payment',
    category: 'Freelance',
    type: 'Income',
    date: '2023-12-03',
    amount: '$800',
  },
  {
    icon: Gift,
    iconColor: '#991B1B',
    title: 'Birthday Gift for Sarah',
    category: 'Shopping',
    type: 'Expense',
    date: '2023-12-04',
    amount: '$120',
  },
];
