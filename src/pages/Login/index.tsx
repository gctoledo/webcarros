import { useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import logoImg from "../../assets/logo.svg";
import Container from "../../components/Container";
import Input from "../../components/Input";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { auth } from "../../services/firebaseConnection";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

import toast from "react-hot-toast";

const schema = z.object({
  email: z
    .string()
    .email("Insira um e-mail válido")
    .min(1, "O campo e-mail é obrigatório"),
  password: z
    .string()
    .min(1, "O campo de senha é obrigatório")
    .min(3, "A senha deve ter pelo menos 3 caracteres"),
});

export type FormData = z.infer<typeof schema>;

function Login() {
  useEffect(() => {
    async function handleLogout() {
      await signOut(auth);
    }

    handleLogout();
  }, []);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), mode: "onChange" });

  const formSubmit = (data: FormData) => {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        toast.success("Logado com sucesso!");
        navigate("/dashboard", { replace: true });
      })
      .catch(() => {
        toast.error("Erro ao fazer o login!");
      });
  };

  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link to={"/"} className="mb-6 max-w-sm w-full">
          <img src={logoImg} alt="Logo do site" className="max-w-sm w-full" />
        </Link>

        <form
          className="bg-white max-w-xl w-full rounded-lg p-4"
          onSubmit={handleSubmit(formSubmit)}
        >
          <div className="mb-3">
            <Input
              type="email"
              placeholder="Digite o seu e-mail"
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <Input
              type="password"
              placeholder="Digite a sua senha"
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>

          <button
            type="submit"
            className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium"
          >
            Acessar
          </button>
        </form>

        <Link to={"/register"}>Ainda não possui uma conta? Cadastre-se!</Link>
      </div>
    </Container>
  );
}

export default Login;
