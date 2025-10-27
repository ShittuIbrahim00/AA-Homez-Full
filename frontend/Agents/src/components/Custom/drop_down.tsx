export interface DropdownModel
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  data?: any[];
  selectItem?: any;
  className?: any;
  style?: any;
  isDisabled?: boolean;
  placeholder: any;
}

// drop down component
function Dropdown(props: DropdownModel) {
  const { data, onChange, className, isDisabled, placeholder } = props;

  return (
    <>
      <select
        className={`w-full py-2 px-3 rounded-md border-[1px] text-[13px] capitalize font-normal border-gray-100 focus:border-gray-100 outline-none ${className}`}
        onChange={onChange}
      >
        {
          // @ts-ignore
          data?.length > 0 ? (
            data?.map((item: any, index) => (
              <option key={index} value={item?.value ? item?.value : item}>
                {/* {item?.name} */}
                {item?.name ? item?.name : item}
              </option>
            ))
          ) : (
            <option selected>{placeholder}(s) are not available</option>
          )
        }
      </select>
    </>
  );
}

export { Dropdown };
