export const createCustomMarkerHTML = (
  imageUrl?: string,
  name?: string,
  isSelected: boolean = false
): string => {
  const selectedClass = isSelected ? 'border-2 border-purple-500' : '';

  const imageContent = imageUrl
    ? `<img src="${imageUrl}" alt="${name || '가맹점'}" class="w-[50px] h-[50px] object-contain rounded-lg" />`
    : `<div class="w-[50px] h-[50px] bg-gray-200 rounded-lg flex items-center justify-center">
         <span class="text-gray-400 text-xs font-bold">${name ? name.charAt(0) : '?'}</span>
       </div>`;

  return `
    <div class="relative">
      <!-- 상자 부분 -->
      <div class="w-[68px] h-[68px] rounded-[12px] bg-white flex items-center justify-center ${selectedClass}"
           style="box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.35);">
        ${imageContent}
      </div>
      
      <!-- 삼각형 부분 -->
      <div class="absolute left-1/2 transform -translate-x-1/2"
           style="top: 68px; 
                  width: 0; 
                  height: 0; 
                  border-left: 8.5px solid transparent; 
                  border-right: 8.5px solid transparent; 
                  border-top: 15px solid white; 
                  filter: drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.35));">
      </div>
    </div>
  `;
};
