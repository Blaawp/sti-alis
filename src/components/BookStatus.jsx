export default function BookStatus({ availability }) {
  if (!availability) {
    return (
      <p className="text-sm lg:text-lg md:text-md">
        <span className="font-bold">Status: </span>
        <span className=" text-success">Available</span>
      </p>
    );
  }

  return (
    <p className="text-sm lg:text-lg md:text-md">
      <span className="font-bold">Status: </span>
      <span className=" text-danger">{availability.status}</span>
    </p>
  );
}
