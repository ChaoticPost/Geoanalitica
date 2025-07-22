import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'

const RegisterPage = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // TODO: Implement registration logic
        setTimeout(() => {
            setIsLoading(false)
            navigate('/login')
        }, 1000)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Input
                type="text"
                label="Имя"
                placeholder="Иван Иванов"
                required
            />
            <Input
                type="email"
                label="Email"
                placeholder="your@email.com"
                required
            />
            <PasswordInput
                label="Пароль"
                required
            />
            <PasswordInput
                label="Подтвердите пароль"
                required
            />
            <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
            >
                Зарегистрироваться
            </Button>
        </form>
    )
}

export default RegisterPage 