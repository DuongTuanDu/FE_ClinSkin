import { useTranslation } from 'react-i18next'
import { Select } from 'antd'

const LanguageSelector = () => {
  const { i18n } = useTranslation()

  const VnFlag = () => (
    <svg
      className='h-5 w-5'
      viewBox='0 0 900 600'
      xmlns='http://www.w3.org/2000/svg'
      role='img'
      aria-label='Vietnam'
    >
      <rect width='900' height='600' fill='#DA251D' />
      <polygon
        fill='#FFFF00'
        points='450,150 518,437 282,262 618,262 382,437'
      />
    </svg>
  )

  const UsFlag = () => (
    <svg
      className='h-5 w-5'
      viewBox='0 0 7410 3900'
      xmlns='http://www.w3.org/2000/svg'
      role='img'
      aria-label='United States'
    >
      <rect width='7410' height='3900' fill='#b22234' />
      <g fill='#fff'>
        {[...Array(13)].map((_, i) => (
          <rect key={i} y={i * 300} width='7410' height='150' />
        ))}
      </g>
      <rect width='2964' height='2100' fill='#3c3b6e' />
      <g fill='#fff' transform='translate(247 210) scale(1.6)'>
        {/* 50 stars in 9 rows */}
        {[...Array(9)].map((_, row) => (
          <g
            key={row}
            transform={`translate(0, ${row * 200})`}
            fill='#fff'
            stroke='none'
          >
            {[...Array(row % 2 === 0 ? 6 : 5)].map((_, col) => {
              const x = col * 333 + (row % 2 === 0 ? 0 : 166)
              return (
                <polygon
                  key={col}
                  points='0,-30 9,-9 30,-9 13,5 19,26 0,13 -19,26 -13,5 -30,-9 -9,-9'
                  transform={`translate(${x},0) scale(1.5)`}
                />
              )
            })}
          </g>
        ))}
      </g>
    </svg>
  )

  const languages = [
    { value: 'en', label: 'English', flag: <UsFlag /> },
    { value: 'vi', label: 'Tiếng Việt', flag: <VnFlag /> }
  ]

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode)
    // Optionally save to localStorage
    localStorage.setItem('preferredLanguage', languageCode)
  }

  return (
    <div className='flex items-center gap-2'>
      <Select
        value={i18n.language}
        onChange={handleLanguageChange}
        size='middle'
        style={{
          width: 130,
          height: 36,
        }}
        dropdownStyle={{
          backgroundColor: 'white',
          border: '1px solid #14b8a6',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        className='language-selector'
        popupClassName='language-selector-dropdown'
      >
        {languages.map((language) => (
          <Select.Option key={language.value} value={language.value}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{language.flag}</span>
              <span>{language.label}</span>
            </div>
          </Select.Option>
        ))}
      </Select>
      

    </div>
  )
}

export default LanguageSelector