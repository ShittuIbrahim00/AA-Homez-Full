import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const SubPropertyFeatures = ({
  subProperty,
  collapsedSections,
  toggleSection,
}: {
  subProperty: any;
  collapsedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
}) => (
  <div className="space-y-4">
    {["appliances", "interior", "otherRooms", "utilities"].map(
      (field) =>
        subProperty[field]?.length > 0 && (
          <div key={field} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <button
              className="flex justify-between items-center w-full p-5 text-left font-bold text-gray-900 hover:bg-gray-50 focus:outline-none transition-colors"
              onClick={() => toggleSection(field)}
            >
              <span className="text-lg capitalize">{field.replace(/([A-Z])/g, ' $1')}</span>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {subProperty[field].length} item{subProperty[field].length > 1 ? 's' : ''}
                </span>
                {collapsedSections[field] ? (
                  <FaChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <FaChevronUp className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </button>
            {!collapsedSections[field] && (
              <div className="px-5 pb-5 border-t border-gray-100">
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  {subProperty[field].map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
    )}
  </div>
);

export default SubPropertyFeatures;