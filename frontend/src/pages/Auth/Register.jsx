import RegisterForm from '../../components/forms/RegisterForm';
import { useTheme } from '../../context/ThemeContext'; 

const Register = () => {
  const { isDark } = useTheme(); 

  return (
    <div className={`min-h-screen py-12 transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-4">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;