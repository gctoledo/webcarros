import { useState, useEffect, FormEvent } from "react";

import { collection, query, getDocs, orderBy, where } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";

import Container from "../../components/Container";

import { Link } from "react-router-dom";

export interface CarProps {
  id: string;
  year: string;
  name: string;
  price: string | number;
  uid: string;
  city: string;
  km: string;
  images: CarImageProps[];
}

interface CarImageProps {
  name: string;
  uid: string;
  url: string;
}

function Home() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);

  const [input, setInput] = useState("");

  function loadCars() {
    const carsRef = collection(db, "cars");
    const queryRef = query(carsRef, orderBy("created", "desc"));

    getDocs(queryRef).then((snapshot) => {
      const listCars = [] as CarProps[];

      snapshot.forEach((doc) => {
        listCars.push({
          id: doc.id,
          city: doc.data().city,
          year: doc.data().year,
          km: doc.data().km,
          name: doc.data().name,
          price: doc.data().price,
          uid: doc.data().uid,
          images: doc.data().images,
        });
      });

      setCars(listCars);
    });
  }

  useEffect(() => {
    loadCars();
  }, []);

  const handleImageLoad = (id: string) => {
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id]);
  };

  const handleSearchCar = async (e: FormEvent) => {
    e.preventDefault();

    if (input === "") {
      loadCars();
      return;
    }

    setCars([]);
    setLoadImages([]);

    const q = query(
      collection(db, "cars"),
      where("name", ">=", input.toUpperCase()),
      where("name", "<=", input.toUpperCase() + "\uf8ff")
    );

    const querySnapshot = await getDocs(q);

    const listCars = [] as CarProps[];

    querySnapshot.forEach((doc) => {
      listCars.push({
        id: doc.id,
        city: doc.data().city,
        year: doc.data().year,
        km: doc.data().km,
        name: doc.data().name,
        price: doc.data().price,
        uid: doc.data().uid,
        images: doc.data().images,
      });
    });

    setCars(listCars);
  };

  return (
    <Container>
      <section>
        <form
          onSubmit={(e) => handleSearchCar(e)}
          className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2"
        >
          <input
            placeholder="Digite o nome do carro"
            className="w-full border-2 h-9 px-3 outline-none rounded-lg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
            type="submit"
          >
            Buscar
          </button>
        </form>
      </section>

      <h1 className="font-bold text-center mt-6 text-2xl mb-4">
        Carros novos e usados em todo Brasil
      </h1>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <Link to={`/car/${car.id}`} key={car.id}>
            <section className="w-full bg-white rounded-lg">
              <div
                className="w-full h-72 rounded-lg bg-slate-200"
                style={{
                  display: loadImages.includes(car.id) ? "none" : "block",
                }}
              ></div>

              <img
                src={car.images[0].url}
                alt={car.name}
                className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
                onLoad={() => handleImageLoad(car.id)}
                style={{
                  display: loadImages.includes(car.id) ? "block" : "none",
                }}
              />
              <p className="font-bold mt-1 mb-2 px-2">{car.name}</p>

              <div className="flex flex-col px-2">
                <span className="text-zinc-700 mb-6">
                  Ano {car.year} | {car.km}km
                </span>
                <strong className="text-black font-medium text-xl">
                  {Number(car.price).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </strong>
              </div>

              <div className="w-full h-px bg-slate-200 my-2"></div>

              <div className="px-2 pb-2">
                <span className="text-black">{car.city}</span>
              </div>
            </section>
          </Link>
        ))}
      </main>
    </Container>
  );
}

export default Home;
