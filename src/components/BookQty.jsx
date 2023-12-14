export default function BookStatus({ qty }) {
  if (qty > 0) {
    return (
      <p className="text-sm lg:text-lg md:text-md ">
        <span className="font-bold">Quantity: </span>
        <span className="text-sm lg:text-lg md:text-md  text-success">
          {qty}
        </span>
      </p>
    );
  }

  return (
    <p className="text-sm lg:text-lg md:text-md ">
      <span className="font-bold"> Quantity: </span>
      <span className="text-sm lg:text-lg md:text-md  text-danger">0</span>
    </p>
  );
}
