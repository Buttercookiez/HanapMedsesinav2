export function Brand() {
  return (
    <a className="brand" href="#home" aria-label="Hanap Medisina home">
      <img
        src={`${import.meta.env.BASE_URL}brand/app-icon-128.png`}
        alt=""
        width="40"
        height="40"
      />
      <span>Hanap Medisina</span>
    </a>
  );
}
