package nstpcapstone1.sims.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import nstpcapstone1.sims.Entity.EventTeacherEntity;
import nstpcapstone1.sims.Entity.SectionEntity;
import nstpcapstone1.sims.Entity.TeacherEntity;
import nstpcapstone1.sims.Entity.TeacherSectionEntity;
import nstpcapstone1.sims.Repository.EventTeacherRepository;
import nstpcapstone1.sims.Repository.TeacherRepository;
import nstpcapstone1.sims.Repository.TeacherSectionRepository;

@Service
public class TeacherSectionService {
	private final TeacherSectionRepository teacherSectionRepository;
	@Autowired
    private TeacherRepository teacherRepository;
    @Autowired
    public TeacherSectionService(TeacherSectionRepository teacherSectionRepository) {
        this.teacherSectionRepository = teacherSectionRepository;
    }

    public void assignTeacherToSection(TeacherSectionEntity teacherSectionEntity) {
        teacherSectionRepository.save(teacherSectionEntity);
    }
    public List<TeacherSectionEntity> getAllTeacherSections() {
        return teacherSectionRepository.findAll();
    }
    public List<SectionEntity> getAllSectionsByTeacherId(String teacherID) {
        return teacherSectionRepository.findAllSectionsByTeacherTeacherID(teacherID);
    }
    @Transactional
	 public boolean deleteBySectionId(Long id) {
	        int deleted = teacherSectionRepository.deleteBySectionId(id);
	        return deleted > 0;
	    }
    public TeacherSectionEntity updateTeacherBySectionId(Long sectionId, Long teacherId) {
        List<TeacherSectionEntity> teacherSectionEntities = teacherSectionRepository.findBySectionId(sectionId);
        if (teacherSectionEntities != null && !teacherSectionEntities.isEmpty()) {
            TeacherEntity newTeacher = teacherRepository.findById(teacherId).orElse(null);
            if (newTeacher != null) {
                TeacherSectionEntity teacherSectionEntity = teacherSectionEntities.get(0);  // Assuming there's only one entity per sectionId
                teacherSectionEntity.setTeacher(newTeacher);
                return teacherSectionRepository.save(teacherSectionEntity);
            } else {
                throw new RuntimeException("Teacher not found with id " + teacherId);
            }
        } else {
            throw new RuntimeException("Section not found with id " + sectionId);
        }
    }
}
