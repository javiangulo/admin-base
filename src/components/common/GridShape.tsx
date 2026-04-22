export default function GridShape() {
  return (
    <>
      <div className="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px]">
        <div className="h-32 w-full rounded-bl-[48px] bg-gradient-to-l from-gray-200 to-transparent dark:from-gray-700" />
      </div>
      <div className="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px]">
        <div className="h-32 w-full rounded-bl-[48px] bg-gradient-to-l from-gray-200 to-transparent dark:from-gray-700" />
      </div>
    </>
  )
}
